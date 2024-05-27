import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, KingdomControllerService, EntryDTO, EntryFullDTO, PageInfo, Page } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { KingdomAccordion } from "./kingdomAccordion";
import { addKingdom, setKingdomPage } from "./store/kingdomPageSlice";
import { makeSelectKingdomPage } from "./store/selector";

interface IKingdomPageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setKingdomPage: (page: Page<EntryDTO>) => {
        let fullPage: Page<EntryFullDTO> = {
            data: page.data?.map((kingdomDTO) => {
                let entryFullDTO: EntryFullDTO = {
                    object: kingdomDTO,
                    images: [],
                    domObjects: {},
                    subObjects: []
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setKingdomPage(fullPage))
    },
    addKingdom: (Kingdom: EntryDTO) => {
        let entryFullDTO: EntryFullDTO = {
            object: Kingdom,
            images: [],
            domObjects: {},
            subObjects: []
        }
        dispatch(addKingdom(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectKingdomPage, (page) => ({
    page
}))

export function KingdomPage(props: IKingdomPageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setKingdomPage, addKingdom } = actionDispatch(useAppDispatch());

    const saveKingdom = async (name: string, description: string): Promise<void> => {
        return KingdomControllerService.saveKingdom({
            name,
            description
        })
            .then((response) => {
                addKingdom(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changeKingdomPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            KingdomControllerService.getKingdoms(pageInfo)
                .then((response) => {
                    setKingdomPage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changeKingdomPage(undefined, 1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Kingdoms</h1>
            <AddNewEntryModal addNewEntry={saveKingdom} addButtonActionText={"Create new Kingdom"} />
            <CustomPagination pageSize={pageSize} changePage={changeKingdomPage} page={page} />
            <KingdomAccordion />
        </div>
    </div>
}