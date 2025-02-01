import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldPlaneControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { ShortEntryEditList } from "../../../../components/accordions/shortEntryEditList";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { PlaneFunction } from "./Functions/planeFunction";


export function PlaneHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deletePlane, editPlane, savePlane } = PlaneFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: planePage, error } = useQuery({
        queryKey: ["planePageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldPlaneControllerService.getPlanesWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((planeDTO) => ({
                        object: planeDTO,
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

    const changePlanePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["planePageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["planePageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Plane named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Planes</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={savePlane} addButtonActionText={"Create new plane"} />
        </> : null}
        {planePage?.data?.length === 0 && <div>There are no planes created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changePlanePage} page={planePage!} />
        <Accordion>
            {planePage.data && planePage.data.map((plane) =>
            (<ShortEntryEditList wordName={world.world?.name!} 
                linkToHomePage={"/politics/planes/"} 
                isAuthor={isAuthor} 
                deleteEntry={deletePlane} 
                updateEntry={editPlane} categoryName={"plane"}
                entryDTO={plane.object} 
                />)
            // (<Container key={plane?.object.id}>
            //     <h1>Plane {plane?.object.name}</h1>
            //     <Row className="accordion-header accordion-button oneEntryButton">
            //         <Col>
            //             <span>#Tags #to #implement</span>
            //             <p>
            //                 {plane?.object.shortDescription}
            //             </p>
            //             {isAuthor ? <>
            //                 <EditEntryModal updateFunction={editPlane} categoryName={"Plane"} id={plane.object?.id!} name={plane.object?.name!} shortDescription={plane.object?.shortDescription!} />
            //                 <DeleteConfirmationModal deleteButtonActionText={"Delete this plane"} deleteObject={deletePlane} title={plane.object?.name!} id={plane.object?.id!} />
            //             </> : null}
            //             <HeaderLink name={plane.object.name!} link={"/worlds/home/" + world.world?.name + "/politics/planes/" + plane.object.name} />
            //         </Col>
            //     </Row>
            // </Container>)
            )}
        </Accordion>
    </div >
}