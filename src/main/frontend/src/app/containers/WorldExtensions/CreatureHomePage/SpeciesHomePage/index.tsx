import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldSpeciesControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { DeleteConfirmationModal } from "../../../../components/modals/deleteConfirmModal";
import { EditEntryModal } from "../../../../components/modals/editEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { HeaderLink } from "../../../Header/HeaderLink";
import { SpeciesFunction } from "./Functions/speciesFunction";


export function SpeciesHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteSpecies, editSpecies, saveSpecies } = SpeciesFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: speciesPage, error } = useQuery({
        queryKey: ["speciesPageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldSpeciesControllerService.getSpeciesWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((speciesDTO) => ({
                        object: speciesDTO,
                        images: [],
                        descriptions: [],
                        domObjects: {},
                        subObjects: []
                    })),
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                }
            }).catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            }),
        placeholderData: keepPreviousData,
    })

    const changeSpeciesPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["speciesPageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["speciesPageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Species named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Species</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveSpecies} addButtonActionText={"Create new species"} />
        </> : null}
        {speciesPage?.data?.length === 0 && <div>There are no species created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeSpeciesPage} page={speciesPage!} />
        <Accordion>
            {speciesPage.data && speciesPage.data.map((species) =>
            (<Container key={species?.object.id}>
                <h1>Species {species?.object.name}</h1>
                <Row className="accordion-header accordion-button oneEntryButton">
                    <Col>
                        <span>#Tags #to #implement</span>
                        <p>
                            {species?.object.shortDescription}
                        </p>
                        {isAuthor ? <>
                            <EditEntryModal updateFunction={editSpecies} categoryName={"Species"} id={species.object?.id!} name={species.object?.name!} shortDescription={species.object?.shortDescription!} />
                            <DeleteConfirmationModal deleteButtonActionText={"Delete this species"} deleteObject={deleteSpecies} title={species.object?.name!} id={species.object?.id!} />
                        </> : null}
                        <HeaderLink name={species.object.name!} link={"/worlds/home/" + world.world?.name + "/creatures/species/" + species.object.name} />
                    </Col>
                </Row>
            </Container>)
            )}
        </Accordion>

    </div >
}