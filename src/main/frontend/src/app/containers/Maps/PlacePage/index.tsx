import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, PlaceControllerService, EntryDTO, EntryFullDTO, PageInfo, Page } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { PlaceAccordion } from "./placeAccordion";
import { addPlace, setPlacePage } from "./store/placePageSlice";
import { makeSelectPlacePage } from "./store/selector";

interface IPlacePageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setPlacePage: (page: Page<EntryDTO>) => {
        let fullPage: Page<EntryFullDTO> = {
            data: page.data?.map((placeDTO) => {
                let entryFullDTO: EntryFullDTO = {
                    object: placeDTO,
                    images: [],
                    domObjects: {},
                    subObjects: []
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setPlacePage(fullPage))
    },
    addPlace: (Place: EntryDTO) => {
        let entryFullDTO: EntryFullDTO = {
            object: Place,
            images: [],
            domObjects: {},
            subObjects: []
        }
        dispatch(addPlace(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectPlacePage, (page) => ({
    page
}))

export function PlacePage(props: IPlacePageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setPlacePage, addPlace } = actionDispatch(useAppDispatch());

    const savePlace = async (name: string, description: string): Promise<void> => {
        return PlaceControllerService.savePlace({
            name,
            description
        })
            .then((response) => {
                addPlace(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changePlacePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            PlaceControllerService.getPlaces(pageInfo)
                .then((response) => {
                    setPlacePage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changePlacePage(undefined, 1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Places</h1>
            <AddNewEntryModal addNewEntry={savePlace} addButtonActionText={"Create new Place"} />
            <CustomPagination pageSize={pageSize} changePage={changePlacePage} page={page} />
            <PlaceAccordion />
        </div>
    </div>
}