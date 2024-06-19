import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RaceFunction } from "./raceFunction";
import { Accordion } from "react-bootstrap";
import { ApiError, RaceControllerService, RaceDTO } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { RaceAccordion } from "./raceAccordion";

export function RacePage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveRace } = RaceFunction({ pageSize, pageNumber })

    const { status, data: racePage, error } = useQuery({
        queryKey: ["racePage", pageNumber, pageSize],
        queryFn: async () => RaceControllerService.getRaces({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((raceDto) => {
                        let raceDTO: RaceDTO = {
                            race: raceDto,
                            images: [],
                            regions: [],
                            subRaces: [],
                            descriptions: []
                        }
                        return raceDTO
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

    const changeRacePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            <h1>Races</h1>
            <AddNewEntryModal addNewEntry={saveRace} addButtonActionText={"Create new race"} />
            <CustomPagination pageSize={pageSize} changePage={changeRacePage} page={racePage!} />
            {racePage.data?.length === 0 && <div>No race created, yet.</div>}
            <Accordion>
                {racePage?.data && racePage.data?.map((race) =>
                    (<RaceAccordion race={race} pageNumber={pageNumber} pageSize={pageSize} status={status} key={race.race?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}