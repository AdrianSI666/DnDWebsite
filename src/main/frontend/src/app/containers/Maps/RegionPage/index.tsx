import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, EntryDTO, Page, PageInfo, RegionControllerService, RegionDTO } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RegionAccordion } from "./regionAccordion";
import { addRegion, setRegionPage } from "./store/regionPageSlice";
import { makeSelectRegionPage } from "./store/selector";

interface IRegionPageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setRegionPage: (page: Page<EntryDTO>) => {
        let fullPage: Page<RegionDTO> = {
            data: page.data?.map((regionDTO) => {
                let entryFullDTO: RegionDTO = {
                    region: regionDTO,
                    images: [],
                    kingdom: {},
                    places: [],
                    cultures: [],
                    races: [],
                    subRaces: [],
                    descriptions: []
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setRegionPage(fullPage))
    },
    addRegion: (region: EntryDTO) => {
        let entryFullDTO: RegionDTO = {
            region: region,
            images: [],
            kingdom: {},
            places: [],
            cultures: [],
            races: [],
            subRaces: [],
            descriptions: []
        }
        dispatch(addRegion(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectRegionPage, (page) => ({
    page
}))

export function RegionPage(props: IRegionPageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setRegionPage, addRegion } = actionDispatch(useAppDispatch());

    const saveRegion = async (name: string, shortDescription: string): Promise<void> => {
        return RegionControllerService.saveRegion({
            name,
            shortDescription
        })
            .then((response) => {
                addRegion(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changeRegionPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            RegionControllerService.getRegions(pageInfo)
                .then((response) => {
                    setRegionPage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changeRegionPage(undefined, 1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Regions</h1>
            <AddNewEntryModal addNewEntry={saveRegion} addButtonActionText={"Create new Region"} />
            <CustomPagination pageSize={pageSize} changePage={changeRegionPage} page={page} />
            <RegionAccordion />
        </div>
    </div>
}