import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { ApiError, WorldDTO, WorldContinentControllerService } from "../../../../../services/openapi";
import useUserState from "../../../../../services/storage/UserStorage";
import { ShortEntryEditList } from "../../../../components/accordions/shortEntryEditList";
import { AddNewEntryModal } from "../../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../../components/pagination/pagination";
import { ContinentFunction } from "./Functions/continentFunction";


export function ContinentHomePage() {
    let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    const { world } = useOutletContext<{ world: WorldDTO }>();
    let { name } = useParams<string>();

    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { deleteContinent, editContinent, saveContinent } = ContinentFunction({pageNumber: pageNumber, pageSize: pageSize, worldId: world.world?.id!, worldName: name!})

    const { status, data: continentPage, error } = useQuery({
        queryKey: ["continentPageByWorldName", pageNumber, pageSize, name],
        queryFn: async () => WorldContinentControllerService.getContinentsWithRelationToWorld(name!, { number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((continentDTO) => ({
                        object: continentDTO,
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

    const changeContinentPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["continentPageByWorldName", pageNumber, size, name] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["continentPageByWorldName", value, pageSize, name] })
        }
    }

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>Continent named {name} doesn't exist.</h1>
    </div>;
    if (world.authorId === userId) {
        isAuthor = true
    }
    return <div className="d-grid gap-2" >
        <h1>Continents</h1>
        {isAuthor ? <>
            <AddNewEntryModal addNewEntry={saveContinent} addButtonActionText={"Create new continent"} />
        </> : null}
        {continentPage?.data?.length === 0 && <div>There are no continents created in this world, yet.</div>}
        <CustomPagination pageSize={pageSize} changePage={changeContinentPage} page={continentPage!} />
        <Accordion>
            {continentPage.data && continentPage.data.map((continent) =>
            (<ShortEntryEditList wordName={world.world?.name!} 
                linkToHomePage={"/politics/continents/"} 
                isAuthor={isAuthor} 
                deleteEntry={deleteContinent} 
                updateEntry={editContinent} categoryName={"continent"}
                entryDTO={continent.object} 
                />)
            // (<Container key={continent?.object.id}>
            //     <h1>Continent {continent?.object.name}</h1>
            //     <Row className="accordion-header accordion-button oneEntryButton">
            //         <Col>
            //             <span>#Tags #to #implement</span>
            //             <p>
            //                 {continent?.object.shortDescription}
            //             </p>
            //             {isAuthor ? <>
            //                 <EditEntryModal updateFunction={editContinent} categoryName={"Continent"} id={continent.object?.id!} name={continent.object?.name!} shortDescription={continent.object?.shortDescription!} />
            //                 <DeleteConfirmationModal deleteButtonActionText={"Delete this continent"} deleteObject={deleteContinent} title={continent.object?.name!} id={continent.object?.id!} />
            //             </> : null}
            //             <HeaderLink name={continent.object.name!} link={"/worlds/home/" + world.world?.name + "/politics/continents/" + continent.object.name} />
            //         </Col>
            //     </Row>
            // </Container>)
            )}
        </Accordion>
    </div >
}