import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, WorldControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { WorldAccordion } from "./worldAccordion";
import { addWorld, setWorldPage } from "./store/worldPageSlice";
import { makeSelectWorldPage } from "./store/selector";

interface IWorldPageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setWorldPage: (page: Page<EntryDTO>) => {
        let fullPage: Page<EntryFullDTO> = {
            data: page.data?.map((worldDTO) => {
                let entryFullDTO: EntryFullDTO = {
                    object: worldDTO,
                    images: [],
                    domObjects: {},
                    subObjects: [],
                    descriptions: []
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setWorldPage(fullPage))
    },
    addWorld: (World: EntryDTO) => {
        let entryFullDTO: EntryFullDTO = {
            object: World,
            images: [],
            domObjects: {},
            subObjects: [],
            descriptions: []
        }
        dispatch(addWorld(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectWorldPage, (page) => ({
    page
}))

export function WorldPage(props: IWorldPageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setWorldPage, addWorld } = actionDispatch(useAppDispatch());

    const saveWorld = async (name: string, shortDescription: string): Promise<void> => {
        return WorldControllerService.saveWorld({
            name,
            shortDescription
        })
            .then((response) => {
                addWorld(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changeWorldPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            WorldControllerService.getWorlds(pageInfo)
                .then((response) => {
                    setWorldPage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changeWorldPage(undefined, 1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Worlds</h1>
            <AddNewEntryModal addNewEntry={saveWorld} addButtonActionText={"Create new World"} />
            <CustomPagination pageSize={pageSize} changePage={changeWorldPage} page={page} />
            <WorldAccordion />
        </div>
    </div>
}