import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, CountyControllerService } from "../../../../../services/openapi";
import { BrowsingListLayout } from "../../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../../components/pagination/pagination";

export function CountyPage() {
    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: countyPage, error } = useQuery({
        queryKey: ["countyPage", pageNumber, pageSize],
        queryFn: async () => CountyControllerService.getCounties({ number: pageNumber, size: pageSize })
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

    const changeCountyPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["countyPage", pageNumber, size] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["countyPage", value, pageSize] })
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
            <CustomPagination pageSize={pageSize} changePage={changeCountyPage} page={countyPage!} />
            {countyPage.data?.length === 0 && <div>No counties created, yet.</div>}
            <Accordion>
                {countyPage?.data && countyPage.data?.map((county) =>
                    (<BrowsingListLayout entryDTOnWorldData={county} mainEntryLink={"politics/counties"}/>)
                )}
            </Accordion>
        </div>
    </div>
}