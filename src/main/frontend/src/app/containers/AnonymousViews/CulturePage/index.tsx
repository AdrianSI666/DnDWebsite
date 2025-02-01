import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, CultureControllerService } from "../../../../services/openapi";
import { BrowsingListLayout } from "../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../components/pagination/pagination";

export function CulturePage() {
    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: culturePage, error } = useQuery({
        queryKey: ["culturePage", pageNumber, pageSize],
        queryFn: async () => CultureControllerService.getCultures({ number: pageNumber, size: pageSize })
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

    const changeCulturePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["culturePage", value, size] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["culturePage", value, size] })
        }
    }

    if (status === "pending") return <div>Loading...</div>
    if (error) {
        console.log(error.message)
        return <div>Error trying to get data from server. Please try again later.</div>
    }
    return <div>
        <div className="d-grid gap-2">
            <h1>Cultures</h1>
            <CustomPagination pageSize={pageSize} changePage={changeCulturePage} page={culturePage!} />
            {culturePage.data?.length === 0 && <div>No cultures created, yet.</div>}
            <Accordion>
                {culturePage?.data && culturePage.data?.map((culture) =>
                    (<BrowsingListLayout entryDTOnWorldData={culture} mainEntryLink={"cultures"} />)
                )}
            </Accordion>
        </div>
    </div>
}