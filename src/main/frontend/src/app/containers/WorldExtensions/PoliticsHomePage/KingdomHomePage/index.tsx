import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldKingdomControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { ShortEntryEditList } from "../../../../components/accordions/shortEntryEditList";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { KingdomFunction } from "./Functions/kingdomFunction";


export function KingdomHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteKingdom, editKingdom, saveKingdom } = KingdomFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: kingdomPage, error } = useQuery({
        queryKey: ["kingdomPageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldKingdomControllerService.getKingdomsWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((kingdomDTO) => ({
                        object: kingdomDTO,
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

    const changeKingdomPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["kingdomPageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["kingdomPageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Kingdom named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Kingdoms</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveKingdom} addButtonActionText={"Create new kingdom"} />
        </> : null}
        {kingdomPage?.data?.length === 0 && <div>There are no kingdoms created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeKingdomPage} page={kingdomPage!} />
        <Accordion>
            {kingdomPage.data && kingdomPage.data.map((kingdom) =>
            (<ShortEntryEditList wordName={world.world?.name!} 
                linkToHomePage={"/politics/kingdoms/"} 
                isAuthor={isAuthor} 
                deleteEntry={deleteKingdom} 
                updateEntry={editKingdom} categoryName={"kingdom"}
                entryDTO={kingdom.object} 
                />)
            // (<Container key={kingdom?.object.id}>
            //     <h1>Kingdom {kingdom?.object.name}</h1>
            //     <Row className="accordion-header accordion-button oneEntryButton">
            //         <Col>
            //             <span>#Tags #to #implement</span>
            //             <p>
            //                 {kingdom?.object.shortDescription}
            //             </p>
            //             {isAuthor ? <>
            //                 <EditEntryModal updateFunction={editKingdom} categoryName={"Kingdom"} id={kingdom.object?.id!} name={kingdom.object?.name!} shortDescription={kingdom.object?.shortDescription!} />
            //                 <DeleteConfirmationModal deleteButtonActionText={"Delete this kingdom"} deleteObject={deleteKingdom} title={kingdom.object?.name!} id={kingdom.object?.id!} />
            //             </> : null}
            //             <HeaderLink name={kingdom.object.name!} link={"/worlds/home/" + world.world?.name + "/politics/kingdoms/" + kingdom.object.name} />
            //         </Col>
            //     </Row>
            // </Container>)
            )}
        </Accordion>
    </div >
}