import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, KingdomControllerService } from "../../../../../services/openapi";
import { BrowsingListLayout } from "../../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../../components/pagination/pagination";

export function KingdomPage() {
    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: kingdomPage, error } = useQuery({
        queryKey: ["kingdomPage", pageNumber, pageSize],
        queryFn: async () => KingdomControllerService.getKingdoms({ number: pageNumber, size: pageSize })
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

    const changeKingdomPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
            queryClient.invalidateQueries({ queryKey: ["kingdomPage", pageNumber, size] })
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
            queryClient.invalidateQueries({ queryKey: ["kingdomPage", value, pageSize] })
        }
    }

    if (status === "pending") return <div>Loading...</div>
    if (error) {
        console.log(error.message)
        return <div>Error trying to get data from server. Please try again later.</div>
    }
    return <div>
        <div className="d-grid gap-2">
            <h1>Kingdoms</h1>
            <CustomPagination pageSize={pageSize} changePage={changeKingdomPage} page={kingdomPage!} />
            {kingdomPage.data?.length === 0 && <div>No kingdoms created, yet.</div>}
            <Accordion>
                {kingdomPage?.data && kingdomPage.data?.map((kingdom) =>
                    (<BrowsingListLayout entryDTOnWorldData={kingdom} mainEntryLink={"politics/kingdoms"}/>)
                )}
            </Accordion>
        </div>
    </div>
}