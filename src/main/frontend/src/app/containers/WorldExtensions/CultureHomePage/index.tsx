import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldCultureControllerService, WorldDTO } from "../../../../services/openapi";
import useUserState from "../../../../services/storage/UserStorage";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { DeleteConfirmationModal } from "../../../components/modals/deleteConfirmModal";
import { EditEntryModal } from "../../../components/modals/editEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { CultureFunction } from "./Functions/cultureFunction";
import { HeaderLink } from "../../Header/HeaderLink";


export function CultureHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteCulture, editCulture, saveCulture } = CultureFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})
    const { status, data: culturePage, error } = useQuery({
        queryKey: ["culturePageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldCultureControllerService.getCulturesWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((cultureDTO) => ({
                        object: cultureDTO,
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

    const changeCulturePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["culturePageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["culturePageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Culture named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Cultures</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveCulture} addButtonActionText={"Create new culture"} />
        </> : null}
        {culturePage?.data?.length === 0 && <div>There are no cultures created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeCulturePage} page={culturePage!} />
        <Accordion>
            {culturePage.data && culturePage.data.map((culture) =>
            (<Container key={culture?.object.id}>
                <h1>Culture {culture?.object.name}</h1>
                <Row className="accordion-header accordion-button oneEntryButton">
                    <Col>
                        <span>#Tags #to #implement</span>
                        <p>
                            {culture?.object.shortDescription}
                        </p>
                        {isAuthor ? <>
                            <EditEntryModal updateFunction={editCulture} categoryName={"Culture"} id={culture.object?.id!} name={culture.object?.name!} shortDescription={culture.object?.shortDescription!} />
                            <DeleteConfirmationModal deleteButtonActionText={"Delete this culture"} deleteObject={deleteCulture} title={culture.object?.name!} id={culture.object?.id!} />
                        </> : null}
                        <HeaderLink name={culture.object.name!} link={"/worlds/home/" + world.world?.name + "/cultures/" + culture.object.name} />
                    </Col>
                </Row>
            </Container>)
            )}
        </Accordion>

    </div >
}