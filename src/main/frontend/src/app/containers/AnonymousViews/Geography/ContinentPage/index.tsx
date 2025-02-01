import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, ContinentControllerService } from "../../../../../services/openapi";
import { BrowsingListLayout } from "../../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../../components/pagination/pagination";

export function ContinentPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: continentPage, error } = useQuery({
        queryKey: ["continentPage", pageNumber, pageSize],
        queryFn: async () => ContinentControllerService.getContinents({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data,
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
            <CustomPagination pageSize={pageSize} changePage={changeContinentPage} page={continentPage!} />
            {continentPage.data?.length === 0 && <div>No continents created, yet.</div>}
            <Accordion>
                {continentPage?.data && continentPage.data?.map((continent) =>
                    (<BrowsingListLayout entryDTOnWorldData={continent} mainEntryLink={"geography/continents"} />)
                )}
            </Accordion>
        </div>
    </div>
}