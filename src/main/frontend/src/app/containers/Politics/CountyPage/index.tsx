import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, EntryFullDTO, CountyControllerService } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { CountyAccordion } from "./countyAccordion";
import { CountyFunction } from "./function/countyFunction";

export function CountyPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveCounty } = CountyFunction({ pageSize, pageNumber })

    const { status, data: countyPage, error } = useQuery({
        queryKey: ["countyPage", pageNumber, pageSize],
        queryFn: async () => CountyControllerService.getCounties({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((countyDto) => {
                        let countyDTO: EntryFullDTO = {
                            object: countyDto,
                            images: [],
                            subObjects: [],
                            descriptions: [],
                            domObjects: {}
                        }
                        return countyDTO
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

    const changeCountyPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Counties</h1>
            <AddNewEntryModal addNewEntry={saveCounty} addButtonActionText={"Create new county"} />
            <CustomPagination pageSize={pageSize} changePage={changeCountyPage} page={countyPage!} />
            {countyPage.data?.length === 0 && <div>No counties created, yet.</div>}
            <Accordion>
                {countyPage?.data && countyPage.data?.map((county) =>
                    (<CountyAccordion county={county} pageNumber={pageNumber} pageSize={pageSize} status={status} key={county.object?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}