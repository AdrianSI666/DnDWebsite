import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TypeAccordion } from "./typeAccordion";
import { Accordion } from "react-bootstrap";
import { CreatureTypeControllerService, ApiError } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { TypeFunction } from "./typeFunction";

export function TypePage() {
    const queryClient = useQueryClient()
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveType } = TypeFunction({ pageSize, pageNumber })

    const { status, data: typePage, error } = useQuery({
        queryKey: ["typePage", pageNumber, pageSize],
        queryFn: async () => CreatureTypeControllerService.getCreatureTypes({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((typeDTO) => ({
                        object: typeDTO,
                        images: [],
                        descriptions: [],
                        domObjects: {},
                        subObjects: []
                    })),
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
            <AddNewEntryModal addNewEntry={saveType} addButtonActionText={"Create new type"} />
            <CustomPagination pageSize={pageSize} changePage={changeTypePage} page={typePage!} />
            {typePage.data?.length === 0 && <div>No types created, yet.</div>}
            <Accordion>
                {typePage?.data && typePage.data?.map((type) =>
                    (<TypeAccordion type={type} pageNumber={pageNumber} pageSize={pageSize} status={status} key={type.object.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}