import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldCountyControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { ShortEntryEditList } from "../../../../components/accordions/shortEntryEditList";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { CountyFunction } from "./Functions/countyFunction";


export function CountyHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteCounty, editCounty, saveCounty } = CountyFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: countyPage, error } = useQuery({
        queryKey: ["countyPageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldCountyControllerService.getCountiesWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((countyDTO) => ({
                        object: countyDTO,
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

    const changeCountyPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["countyPageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["countyPageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>County named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Counties</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveCounty} addButtonActionText={"Create new county"} />
        </> : null}
        {countyPage?.data?.length === 0 && <div>There are no counties created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeCountyPage} page={countyPage!} />
        <Accordion>
            {countyPage.data && countyPage.data.map((county) =>
            (<ShortEntryEditList wordName={world.world?.name!} 
                linkToHomePage={"/politics/counties/"} 
                isAuthor={isAuthor} 
                deleteEntry={deleteCounty} 
                updateEntry={editCounty} categoryName={"county"}
                entryDTO={county.object} 
                />)
            // (<Container key={county?.object.id}>
            //     <h1>County {county?.object.name}</h1>
            //     <Row className="accordion-header accordion-button oneEntryButton">
            //         <Col>
            //             <span>#Tags #to #implement</span>
            //             <p>
            //                 {county?.object.shortDescription}
            //             </p>
            //             {isAuthor ? <>
            //                 <EditEntryModal updateFunction={editCounty} categoryName={"County"} id={county.object?.id!} name={county.object?.name!} shortDescription={county.object?.shortDescription!} />
            //                 <DeleteConfirmationModal deleteButtonActionText={"Delete this county"} deleteObject={deleteCounty} title={county.object?.name!} id={county.object?.id!} />
            //             </> : null}
            //             <HeaderLink name={county.object.name!} link={"/worlds/home/" + world.world?.name + "/politics/counties/" + county.object.name} />
            //         </Col>
            //     </Row>
            // </Container>)
            )}
        </Accordion>
    </div >
}