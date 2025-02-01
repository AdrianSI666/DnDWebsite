import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldSubSpeciesControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { DeleteConfirmationModal } from "../../../../components/modals/deleteConfirmModal";
import { EditEntryModal } from "../../../../components/modals/editEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { HeaderLink } from "../../../Header/HeaderLink";
import { SubSpeciesFunction } from "./Functions/subSpeciesFunction";


export function SubspeciesHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteSubSpecies, editSubSpecies, saveSubSpecies } = SubSpeciesFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: subspeciesPage, error } = useQuery({
        queryKey: ["subSpeciesPageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldSubSpeciesControllerService.getSubSpeciesWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((subspeciesDTO) => ({
                        object: subspeciesDTO,
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

    const changeSubspeciesPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["subSpeciesPageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["subSpeciesPageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Subspecies named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Subspecies</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveSubSpecies} addButtonActionText={"Create new subspecies"} />
        </> : null}
        {subspeciesPage?.data?.length === 0 && <div>There are no subspecies created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeSubspeciesPage} page={subspeciesPage!} />
        <Accordion>
            {subspeciesPage.data && subspeciesPage.data.map((subspecies) =>
            (<Container key={subspecies?.object.id}>
                <h1>Subspecies {subspecies?.object.name}</h1>
                <Row className="accordion-header accordion-button oneEntryButton">
                    <Col>
                        <span>#Tags #to #implement</span>
                        <p>
                            {subspecies?.object.shortDescription}
                        </p>
                        {isAuthor ? <>
                            <EditEntryModal updateFunction={editSubSpecies} categoryName={"Subspecies"} id={subspecies.object?.id!} name={subspecies.object?.name!} shortDescription={subspecies.object?.shortDescription!} />
                            <DeleteConfirmationModal deleteButtonActionText={"Delete this subspecies"} deleteObject={deleteSubSpecies} title={subspecies.object?.name!} id={subspecies.object?.id!} />
                        </> : null}
                        <HeaderLink name={subspecies.object.name!} link={"/worlds/home/" + world.world?.name + "/creatures/subspecies/" + subspecies.object.name} />
                    </Col>
                </Row>
            </Container>)
            )}
        </Accordion>

    </div >
}