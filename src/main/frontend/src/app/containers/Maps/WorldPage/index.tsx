import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { WorldFunction } from "./worldFunction";
import { Accordion } from "react-bootstrap";
import { ApiError, EntryFullDTO, WorldControllerService } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { WorldAccordion } from "./worldAccordion";

export function WorldPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveWorld } = WorldFunction({ pageSize, pageNumber })

    const { status, data: worldPage, error } = useQuery({
        queryKey: ["worldPage", pageNumber, pageSize],
        queryFn: async () => WorldControllerService.getWorlds({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((worldDto) => {
                        let worldDTO: EntryFullDTO = {
                            object: worldDto,
                            images: [],
                            subObjects: [],
                            descriptions: [],
                            domObjects: {}
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
            <AddNewEntryModal addNewEntry={saveWorld} addButtonActionText={"Create new world"} />
            <CustomPagination pageSize={pageSize} changePage={changeWorldPage} page={worldPage!} />
            {worldPage.data?.length === 0 && <div>No worlds created, yet.</div>}
            <Accordion>
                {worldPage?.data && worldPage.data?.map((world) =>
                    (<WorldAccordion world={world} pageNumber={pageNumber} pageSize={pageSize} status={status} key={world.object?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}