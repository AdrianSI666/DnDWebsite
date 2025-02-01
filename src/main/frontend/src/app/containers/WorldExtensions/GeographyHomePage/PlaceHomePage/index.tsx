import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldPlaceControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { ShortEntryEditList } from "../../../../components/accordions/shortEntryEditList";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { PlaceFunction } from "./Functions/placeFunction";


export function PlaceHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deletePlace, editPlace, savePlace } = PlaceFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: placePage, error } = useQuery({
        queryKey: ["placePageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldPlaceControllerService.getPlacesWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((placeDTO) => ({
                        object: placeDTO,
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

    const changePlacePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["placePageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["placePageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Place named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Places</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={savePlace} addButtonActionText={"Create new place"} />
        </> : null}
        {placePage?.data?.length === 0 && <div>There are no places created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changePlacePage} page={placePage!} />
        <Accordion>
            {placePage.data && placePage.data.map((place) =>
            (<ShortEntryEditList wordName={world.world?.name!} 
                linkToHomePage={"/politics/places/"} 
                isAuthor={isAuthor} 
                deleteEntry={deletePlace} 
                updateEntry={editPlace} categoryName={"place"}
                entryDTO={place.object} 
                />)
            // (<Container key={place?.object.id}>
            //     <h1>Place {place?.object.name}</h1>
            //     <Row className="accordion-header accordion-button oneEntryButton">
            //         <Col>
            //             <span>#Tags #to #implement</span>
            //             <p>
            //                 {place?.object.shortDescription}
            //             </p>
            //             {isAuthor ? <>
            //                 <EditEntryModal updateFunction={editPlace} categoryName={"Place"} id={place.object?.id!} name={place.object?.name!} shortDescription={place.object?.shortDescription!} />
            //                 <DeleteConfirmationModal deleteButtonActionText={"Delete this place"} deleteObject={deletePlace} title={place.object?.name!} id={place.object?.id!} />
            //             </> : null}
            //             <HeaderLink name={place.object.name!} link={"/worlds/home/" + world.world?.name + "/politics/places/" + place.object.name} />
            //         </Col>
            //     </Row>
            // </Container>)
            )}
        </Accordion>
    </div >
}