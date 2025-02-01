import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, CreatureTypeControllerService } from "../../../../../services/openapi";
import { BrowsingListLayout } from "../../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../../components/pagination/pagination";

export function TypePage() {
    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: typePage, error } = useQuery({
        queryKey: ["typePage", pageNumber, pageSize],
        queryFn: async () => CreatureTypeControllerService.getCreatureTypes({ number: pageNumber, size: pageSize })
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

    const changeTypePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["typePage", value, size] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["typePage", value, size] })
        }
    }

    if (status === "pending") return <div>Loading...</div>
    if (error) {
        console.log(error.message)
        return <div>Error trying to get data from server. Please try again later.</div>
    }
    return <div>
        <div className="d-grid gap-2">
            <h1>Types</h1>
            <CustomPagination pageSize={pageSize} changePage={changeTypePage} page={typePage!} />
            {typePage.data?.length === 0 && <div>No types created, yet.</div>}
            <Accordion>
                {typePage?.data && typePage.data?.map((type) =>
                    (<BrowsingListLayout entryDTOnWorldData={type} mainEntryLink={"creatures/types"} />)
                )}
            </Accordion>
        </div>
    </div>
}