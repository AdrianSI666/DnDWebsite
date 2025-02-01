import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, WorldControllerService } from "../../../../services/openapi";
import { EntryDTOnWorldData } from "../../../../services/openapi/models/EntryDTOnWorldData";
import { BrowsingListLayout } from "../../../components/accordions/browsingListLayout";
import { CustomPagination } from "../../../components/pagination/pagination";

export function WorldPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)

    const { status, data: worldPage, error } = useQuery({
        queryKey: ["worldPage", pageNumber, pageSize],
        queryFn: async () => WorldControllerService.getWorlds({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((worldDto) => {
                        let worldDTO: EntryDTOnWorldData = {
                            id: worldDto.id,
                            name: worldDto.name,
                            shortDescription: worldDto.shortDescription,
                            authorName: worldDto.authorName,
                            worldName: worldDto.name
                        }
                        return worldDTO
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

    const changeWorldPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Worlds</h1>
            <CustomPagination pageSize={pageSize} changePage={changeWorldPage} page={worldPage!} />
            {worldPage.data?.length === 0 && <div>No worlds created, yet.</div>}
            <Accordion>
                {worldPage?.data && worldPage.data?.map((world) =>
                    (<BrowsingListLayout entryDTOnWorldData={world} mainEntryLink={"worlds"} />)
                )}
            </Accordion>
        </div>
    </div>
}