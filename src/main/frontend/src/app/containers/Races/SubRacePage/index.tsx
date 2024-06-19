import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SubRaceFunction } from "./subRaceFunction";
import { Accordion } from "react-bootstrap";
import { ApiError, SubRaceControllerService, SubRaceDTO } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { SubRaceAccordion } from "./subRaceAccordion";

export function SubRacePage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveSubRace } = SubRaceFunction({ pageSize, pageNumber })

    const { status, data: subRacePage, error } = useQuery({
        queryKey: ["subRacePage", pageNumber, pageSize],
        queryFn: async () => SubRaceControllerService.getSubRaces({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((subRaceDto) => {
                        let subRaceDTO: SubRaceDTO = {
                            subRace: subRaceDto,
                            images: [],
                            regions: [],
                            race: {},
                            descriptions: []
                        }
                        return subRaceDTO
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

    const changeSubRacePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>SubRaces</h1>
            <AddNewEntryModal addNewEntry={saveSubRace} addButtonActionText={"Create new subrace"} />
            <CustomPagination pageSize={pageSize} changePage={changeSubRacePage} page={subRacePage!} />
            {subRacePage.data?.length === 0 && <div>No subrace created, yet.</div>}
            <Accordion>
                {subRacePage?.data && subRacePage.data?.map((subRace) =>
                    (<SubRaceAccordion subRace={subRace} pageNumber={pageNumber} pageSize={pageSize} status={status} key={subRace.subRace?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}