import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, EntryDTO, PageInfo, RaceControllerService, RaceDTO } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RaceAccordion } from "./raceAccordion";
import { addRace, setRacePage } from "./store/racePageSlice";
import { makeSelectRacePage } from "./store/selector";

interface IRacePageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setRacePage: (page: Page<EntryDTO>) => {
        let fullPage: Page<RaceDTO> = {
            data: page.data?.map((raceDto) => {
                let entryFullDTO: RaceDTO = {
                    race: raceDto,
                    images: [],
                    regions: [],
                    subRaces: []
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setRacePage(fullPage))
    },
    addRace: (race: EntryDTO) => {
        let entryFullDTO: RaceDTO = {
            race: race,
            images: [],
            regions: [],
            subRaces: []
        }
        dispatch(addRace(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectRacePage, (page) => ({
    page
}))

export function RacePage(props: IRacePageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setRacePage, addRace } = actionDispatch(useAppDispatch());

    const saveRace = async (name: string, description: string): Promise<void> => {
        return RaceControllerService.saveRace({
            name,
            description
        })
            .then((response) => {
                addRace(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changeRacePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        let sendSize = pageSize
        if (size && size !== pageSize) {
            sendSize = size
            setPageSize(size);
        }
        const pageInfo: PageInfo = {
            number: value,
            size: sendSize
        };
        if (value !== page.currentPage || sendSize !== pageSize) {
            RaceControllerService.getRaces(pageInfo)
                .then((response) => {
                    setRacePage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changeRacePage(undefined, 1, 10);
    })

    return <div>
        <div className="d-grid gap-2">
            <h1>Races</h1>
            <AddNewEntryModal addNewEntry={saveRace} categoryName="Race" />
            <CustomPagination pageSize={pageSize} changePage={changeRacePage} page={page} />
            <RaceAccordion />
        </div>
    </div>
}