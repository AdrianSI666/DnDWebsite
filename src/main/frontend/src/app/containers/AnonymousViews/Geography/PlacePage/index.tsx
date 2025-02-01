import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, PlaceControllerService } from "../../../../../services/openapi";
import { BrowsingListLayout } from "../../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../../components/pagination/pagination";

export function PlacePage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: placePage, error } = useQuery({
        queryKey: ["placePage", pageNumber, pageSize],
        queryFn: async () => PlaceControllerService.getPlaces({ number: pageNumber, size: pageSize })
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

    const changePlacePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Places</h1>
            <CustomPagination pageSize={pageSize} changePage={changePlacePage} page={placePage!} />
            {placePage.data?.length === 0 && <div>No places created, yet.</div>}
            <Accordion>
                {placePage?.data && placePage.data?.map((place) =>
                    (<BrowsingListLayout entryDTOnWorldData={place} mainEntryLink={"geography/places"} />)
                )}
            </Accordion>
        </div>
    </div>
}