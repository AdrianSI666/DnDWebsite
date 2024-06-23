import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ContinentFunction } from "./continentFunction";
import { Accordion } from "react-bootstrap";
import { ApiError, EntryFullDTO, ContinentControllerService } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { ContinentAccordion } from "./continentAccordion";

export function ContinentPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveContinent } = ContinentFunction({ pageSize, pageNumber })

    const { status, data: continentPage, error } = useQuery({
        queryKey: ["continentPage", pageNumber, pageSize],
        queryFn: async () => ContinentControllerService.getContinents({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((continentDto) => {
                        let continentDTO: EntryFullDTO = {
                            object: continentDto,
                            images: [],
                            subObjects: [],
                            descriptions: [],
                            domObjects: {}
                        }
                        return continentDTO
                    }),
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
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
        }
    }

    if (status === "pending") return <div>Loading...</div>
    if (error) {
        console.log(error.message)
        return <div>Error trying to get data from server. Please try again later.</div>
    }
    return <div>
        <div className="d-grid gap-2">
            <h1>Continents</h1>
            <AddNewEntryModal addNewEntry={saveContinent} addButtonActionText={"Create new continent"} />
            <CustomPagination pageSize={pageSize} changePage={changeContinentPage} page={continentPage!} />
            {continentPage.data?.length === 0 && <div>No continents created, yet.</div>}
            <Accordion>
                {continentPage?.data && continentPage.data?.map((continent) =>
                    (<ContinentAccordion continent={continent} pageNumber={pageNumber} pageSize={pageSize} status={status} key={continent.object?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}