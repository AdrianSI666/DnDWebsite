import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, RegionControllerService } from "../../../../../services/openapi";
import { BrowsingListLayout } from "../../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../../components/pagination/pagination";

export function RegionPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: regionPage, error } = useQuery({
        queryKey: ["regionPage", pageNumber, pageSize],
        queryFn: async () => RegionControllerService.getRegions({ number: pageNumber, size: pageSize })
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

    const changeRegionPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Regions</h1>
            <CustomPagination pageSize={pageSize} changePage={changeRegionPage} page={regionPage!} />
            {regionPage.data?.length === 0 && <div>No regions created, yet.</div>}
            <Accordion>
                {regionPage?.data && regionPage.data?.map((region) =>
                    (<BrowsingListLayout entryDTOnWorldData={region} mainEntryLink={"geography/regions"} />)
                )}
            </Accordion>
        </div>
    </div>
}