import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlaneFunction } from "./planeFunction";
import { Accordion } from "react-bootstrap";
import { ApiError, EntryFullDTO, PlaneControllerService } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { PlaneAccordion } from "./planeAccordion";

export function PlanePage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { savePlane } = PlaneFunction({ pageSize, pageNumber })

    const { status, data: planePage, error } = useQuery({
        queryKey: ["planePage", pageNumber, pageSize],
        queryFn: async () => PlaneControllerService.getPlanes({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((planeDto) => {
                        let planeDTO: EntryFullDTO = {
                            object: planeDto,
                            images: [],
                            subObjects: [],
                            descriptions: [],
                            domObjects: {}
                        }
                        return planeDTO
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

    const changePlanePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Planes</h1>
            <AddNewEntryModal addNewEntry={savePlane} addButtonActionText={"Create new plane"} />
            <CustomPagination pageSize={pageSize} changePage={changePlanePage} page={planePage!} />
            {planePage.data?.length === 0 && <div>No planes created, yet.</div>}
            <Accordion>
                {planePage?.data && planePage.data?.map((plane) =>
                    (<PlaneAccordion plane={plane} pageNumber={pageNumber} pageSize={pageSize} status={status} key={plane.object?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}