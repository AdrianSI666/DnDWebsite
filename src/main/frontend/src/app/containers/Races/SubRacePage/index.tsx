import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, EntryDTO, PageInfo, SubRaceControllerService, SubRaceDTO } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { SubRaceAccordion } from "./subRaceAccordion";
import { addSubRace, setSubRacePage } from "./store/subRacePageSlice";
import { makeSelectSubRacePage } from "./store/selector";

interface ISubRacePageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setSubRacePage: (page: Page<EntryDTO>) => {
        let fullPage: Page<SubRaceDTO> = {
            data: page.data?.map((subRaceDto) => {
                let entryFullDTO: SubRaceDTO = {
                    subRace: subRaceDto,
                    images: [],
                    regions: [],
                    race: {}
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setSubRacePage(fullPage))
    },
    addSubRace: (subRace: EntryDTO) => {
        let entryFullDTO: SubRaceDTO = {
            subRace: subRace,
            images: [],
            regions: [],
            race: {}
        }
        dispatch(addSubRace(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectSubRacePage, (page) => ({
    page
}))

export function SubRacePage(props: ISubRacePageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setSubRacePage, addSubRace } = actionDispatch(useAppDispatch());

    const saveSubRace = async (name: string, description: string): Promise<void> => {
        return SubRaceControllerService.saveSubRace({
            name,
            description
        })
            .then((response) => {
                addSubRace(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changeSubRacePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            SubRaceControllerService.getSubRaces(pageInfo)
                .then((response) => {
                    setSubRacePage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changeSubRacePage(undefined, 1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>SubRaces</h1>
            <AddNewEntryModal addNewEntry={saveSubRace} addButtonActionText={"Create new Sub Race"} />
            <CustomPagination pageSize={pageSize} changePage={changeSubRacePage} page={page} />
            <SubRaceAccordion />
        </div>
    </div>
}