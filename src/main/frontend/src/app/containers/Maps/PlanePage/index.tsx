import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, PlaneControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../../services/openapi";
import { Page } from "../../../../services/openapi/models/Page";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { PlaneAccordion } from "./planeAccordion";
import { addPlane, setPlanePage } from "./store/planePageSlice";
import { makeSelectPlanePage } from "./store/selector";

interface IPlanePageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setPlanePage: (page: Page<EntryDTO>) => {
        let fullPage: Page<EntryFullDTO> = {
            data: page.data?.map((planeDTO) => {
                let entryFullDTO: EntryFullDTO = {
                    object: planeDTO,
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
        dispatch(setPlanePage(fullPage))
    },
    addPlane: (Plane: EntryDTO) => {
        let entryFullDTO: EntryFullDTO = {
            object: Plane,
            images: [],
            domObjects: {},
            subObjects: [],
            descriptions: []
        }
        dispatch(addPlane(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectPlanePage, (page) => ({
    page
}))

export function PlanePage(props: IPlanePageProps) {
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setPlanePage, addPlane } = actionDispatch(useAppDispatch());

    const savePlane = async (name: string, shortDescription: string): Promise<void> => {
        return PlaneControllerService.savePlane({
            name,
            shortDescription
        })
            .then((response) => {
                addPlane(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changePlanePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
            PlaneControllerService.getPlanes(pageInfo)
                .then((response) => {
                    setPlanePage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changePlanePage(undefined, 1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Planes</h1>
            <AddNewEntryModal addNewEntry={savePlane} addButtonActionText={"Create new Plane"} />
            <CustomPagination pageSize={pageSize} changePage={changePlanePage} page={page} />
            <PlaneAccordion />
        </div>
    </div>
}