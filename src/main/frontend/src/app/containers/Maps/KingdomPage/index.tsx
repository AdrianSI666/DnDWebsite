import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, EntryFullDTO, KingdomControllerService } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { KingdomAccordion } from "./kingdomAccordion";
import { KingdomFunction } from "./function/kingdomFunction";

export function KingdomPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveKingdom } = KingdomFunction({ pageSize, pageNumber })

    const { status, data: kingdomPage, error } = useQuery({
        queryKey: ["kingdomPage", pageNumber, pageSize],
        queryFn: async () => KingdomControllerService.getKingdoms({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((kingdomDto) => {
                        let kingdomDTO: EntryFullDTO = {
                            object: kingdomDto,
                            images: [],
                            subObjects: [],
                            descriptions: [],
                            domObjects: {}
                        }
                        return kingdomDTO
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

    const changeKingdomPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Kingdoms</h1>
            <AddNewEntryModal addNewEntry={saveKingdom} addButtonActionText={"Create new kingdom"} />
            <CustomPagination pageSize={pageSize} changePage={changeKingdomPage} page={kingdomPage!} />
            {kingdomPage.data?.length === 0 && <div>No kingdoms created, yet.</div>}
            <Accordion>
                {kingdomPage?.data && kingdomPage.data?.map((kingdom) =>
                    (<KingdomAccordion kingdom={kingdom} pageNumber={pageNumber} pageSize={pageSize} status={status} key={kingdom.object?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}