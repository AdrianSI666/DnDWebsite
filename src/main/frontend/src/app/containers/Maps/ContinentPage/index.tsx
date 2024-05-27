import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, ContinentControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { ContinentAccordion } from "./continentAccordion";
import { addContinent, setContinentPage } from "./store/continentPageSlice";
import { makeSelectContinentPage } from "./store/selector";

interface IContinentPageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setContinentPage: (page: Page<EntryDTO>) => {
        let fullPage: Page<EntryFullDTO> = {
            data: page.data?.map((continentDTO) => {
                let entryFullDTO: EntryFullDTO = {
                    object: continentDTO,
                    images: [],
                    domObjects: {},
                    subObjects: []
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setContinentPage(fullPage))
    },
    addContinent: (Continent: EntryDTO) => {
        let entryFullDTO: EntryFullDTO = {
            object: Continent,
            images: [],
            domObjects: {},
            subObjects: []
        }
        dispatch(addContinent(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectContinentPage, (page) => ({
    page
}))

export function ContinentPage(props: IContinentPageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setContinentPage, addContinent } = actionDispatch(useAppDispatch());

    const saveContinent = async (name: string, description: string): Promise<void> => {
        return ContinentControllerService.saveContinent({
            name,
            description
        })
            .then((response) => {
                addContinent(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changeContinentPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            ContinentControllerService.getContinents(pageInfo)
                .then((response) => {
                    setContinentPage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changeContinentPage(undefined, 1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Continents</h1>
            <AddNewEntryModal addNewEntry={saveContinent} addButtonActionText={"Create new Continent"} />
            <CustomPagination pageSize={pageSize} changePage={changeContinentPage} page={page} />
            <ContinentAccordion />
        </div>
    </div>
}