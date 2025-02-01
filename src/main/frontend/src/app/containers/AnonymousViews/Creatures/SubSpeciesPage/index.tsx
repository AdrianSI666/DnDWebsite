import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, SubSpeciesControllerService } from "../../../../../services/openapi";
import { BrowsingListLayout } from "../../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../../components/pagination/pagination";

export function SubSpeciesPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: subSpeciesPage, error } = useQuery({
        queryKey: ["subSpeciesPage", pageNumber, pageSize],
        queryFn: async () => SubSpeciesControllerService.getSubSpecies({ number: pageNumber, size: pageSize })
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

    const changeSubSpeciesPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Subspecies</h1>
            <CustomPagination pageSize={pageSize} changePage={changeSubSpeciesPage} page={subSpeciesPage!} />
            {subSpeciesPage.data?.length === 0 && <div>No subspecies created, yet.</div>}
            <Accordion>
                {subSpeciesPage?.data && subSpeciesPage.data?.map((subSpecies) =>
                    (<BrowsingListLayout entryDTOnWorldData={subSpecies} mainEntryLink={"creatures/subspecies"} />)
                )}
            </Accordion>
        </div>
    </div>
}