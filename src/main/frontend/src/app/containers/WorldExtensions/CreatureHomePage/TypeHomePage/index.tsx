import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldCreatureTypeControllerService, WorldDTO } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { DeleteConfirmationModal } from "../../../../components/modals/deleteConfirmModal";
import { EditEntryModal } from "../../../../components/modals/editEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { HeaderLink } from "../../../Header/HeaderLink";
import { TypeFunction } from "../../../Creatures/TypePage/typeFunction";


export function TypeHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteType, editType, saveType } = TypeFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: typePage, error } = useQuery({
        queryKey: ["typePageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldCreatureTypeControllerService.getCreatureTypesWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((typeDTO) => ({
                        object: typeDTO,
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

    const changeTypePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["typePage", value, size] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["typePage", value, size] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Type named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Types</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveType} addButtonActionText={"Create new type"} />
        </> : null}
        {typePage?.data?.length === 0 && <div>There are no types created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeTypePage} page={typePage!} />
        <Accordion>
            {typePage.data && typePage.data.map((type) =>
            (<Container key={type?.object.id}>
                <h1>Type {type?.object.name}</h1>
                <Row className="accordion-header accordion-button oneEntryButton">
                    <Col>
                        <span>#Tags #to #implement</span>
                        <p>
                            {type?.object.shortDescription}
                        </p>
                        {isAuthor ? <>
                            <EditEntryModal updateFunction={editType} categoryName={"Type"} id={type.object?.id!} name={type.object?.name!} shortDescription={type.object?.shortDescription!} />
                            <DeleteConfirmationModal deleteButtonActionText={"Delete this type"} deleteObject={deleteType} title={type.object?.name!} id={type.object?.id!} />
                        </> : null}
                        <HeaderLink name={type.object.name!} link={"/worlds/home/" + world.world?.name + "/creatures/types/" + type.object.name} />
                    </Col>
                </Row>
            </Container>)
            )}
        </Accordion>

    </div >
}