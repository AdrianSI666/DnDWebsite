import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError, CultureControllerService } from "../../../services/openapi";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../components/pagination/pagination";
import { CultureAccordion } from "./cultureAccordion";
import { CultureFunction } from "./cultureFunction";
import { Accordion } from "react-bootstrap";

export function CulturePage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveCulture } = CultureFunction({ pageSize, pageNumber })

    const { status, data: culturePage, error } = useQuery({
        queryKey: ["culturePage", pageNumber, pageSize],
        queryFn: async () => CultureControllerService.getCultures({ number: pageNumber, size: pageSize })
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
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
        }
    }

    if (status === "pending") return <div>Loading...</div>
    if (error) {
        console.log(error.message)
        return <div>Error trying to get data from server. Please try again later.</div> //Should be a redirect to error page maybe?
    }
    return <div>
        <div className="d-grid gap-2">
            <h1>Cultures</h1>
            <AddNewEntryModal addNewEntry={saveCulture} addButtonActionText={"Create new culture"} />
            <CustomPagination pageSize={pageSize} changePage={changeCulturePage} page={culturePage!} />
            {culturePage.data?.length === 0 && <div>No culture created, yet.</div>}
            <Accordion>
                {culturePage?.data && culturePage.data?.map((culture) =>
                    (<CultureAccordion culture={culture} pageNumber={pageNumber} pageSize={pageSize} status={status} key={culture.object.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}