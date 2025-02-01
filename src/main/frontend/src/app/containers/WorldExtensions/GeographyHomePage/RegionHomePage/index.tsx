import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldRegionControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { ShortEntryEditList } from "../../../../components/accordions/shortEntryEditList";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { RegionFunction } from "./Functions/regionFunction";


export function RegionHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteRegion, editRegion, saveRegion } = RegionFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: regionPage, error } = useQuery({
        queryKey: ["regionPageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldRegionControllerService.getRegionsWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((regionDTO) => ({
                        object: regionDTO,
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

    const changeRegionPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["regionPageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["regionPageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Region named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Regions</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveRegion} addButtonActionText={"Create new region"} />
        </> : null}
        {regionPage?.data?.length === 0 && <div>There are no regions created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeRegionPage} page={regionPage!} />
        <Accordion>
            {regionPage.data && regionPage.data.map((region) =>
            (<ShortEntryEditList wordName={world.world?.name!} 
                linkToHomePage={"/politics/regions/"} 
                isAuthor={isAuthor} 
                deleteEntry={deleteRegion} 
                updateEntry={editRegion} categoryName={"region"}
                entryDTO={region.object} 
                />)
            // (<Container key={region?.object.id}>
            //     <h1>Region {region?.object.name}</h1>
            //     <Row className="accordion-header accordion-button oneEntryButton">
            //         <Col>
            //             <span>#Tags #to #implement</span>
            //             <p>
            //                 {region?.object.shortDescription}
            //             </p>
            //             {isAuthor ? <>
            //                 <EditEntryModal updateFunction={editRegion} categoryName={"Region"} id={region.object?.id!} name={region.object?.name!} shortDescription={region.object?.shortDescription!} />
            //                 <DeleteConfirmationModal deleteButtonActionText={"Delete this region"} deleteObject={deleteRegion} title={region.object?.name!} id={region.object?.id!} />
            //             </> : null}
            //             <HeaderLink name={region.object.name!} link={"/worlds/home/" + world.world?.name + "/politics/regions/" + region.object.name} />
            //         </Col>
            //     </Row>
            // </Container>)
            )}
        </Accordion>
    </div >
}