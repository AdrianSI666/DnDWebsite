import { useEffect, useState } from "react";
import { ApiError, CultureControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../services/openapi";
import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { addCulture, setCulturePage } from "./store/culturePageSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Page } from "../../../services/openapi/models/Page";
import { CultureAccordion } from "./cultureAccordion";
import { useParams } from "react-router-dom";
import { CustomPagination } from "../../components/pagination/pagination";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";
import { makeSelectCulturePage } from "./store/selector";

interface ICulturePageProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setCulturePage: (page: Page<EntryDTO>) => {
        let fullPage: Page<EntryFullDTO> = {
            data: page.data?.map((CultureDTO) => {
                let entryFullDTO: EntryFullDTO = {
                    object: CultureDTO,
                    images: [],
                    domObjects: {},
                    subObjects: []
                }
                return entryFullDTO
            }),
            currentPage: page.currentPage,
            totalPages: page.totalPages
        }
        dispatch(setCulturePage(fullPage))
    },
    addCulture: (culture: EntryDTO) => {
        let entryFullDTO: EntryFullDTO = {
            object: culture,
            images: [],
            domObjects: {},
            subObjects: []
        }
        dispatch(addCulture(entryFullDTO))
    }
})

const stateSelect = createSelector(makeSelectCulturePage, (page) => ({
    page
}))

export function CulturePage(props: ICulturePageProps) {
    //let { name, subname } = useParams();
    //console.log(name);
    //console.log(subname);
    const [pageSize, setPageSize] = useState(0);
    const { page } = useAppSelector(stateSelect);
    const { setCulturePage, addCulture } = actionDispatch(useAppDispatch());

    const saveCulture = async (name: string, description: string): Promise<void> => {
        return CultureControllerService.saveCulture({
            name,
            description
        })
            .then((response) => {
                addCulture(response);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const changeCulturePage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        let sendSize = pageSize
        if(size && size !== pageSize){
            sendSize = size
            setPageSize(size);
        }
        const pageInfo: PageInfo = {
            number: value,
            size: sendSize
        };
        if (value !== page.currentPage || sendSize !== pageSize) {
            CultureControllerService.getCultures(pageInfo)
                .then((response) => {
                    setCulturePage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    useEffect(() => {
        changeCulturePage(undefined, 1, 10);
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Cultures</h1>
            <AddNewEntryModal addNewEntry={saveCulture} categoryName="Culture" />
            <CustomPagination pageSize={pageSize} changePage={changeCulturePage} page={page}/>
            <CultureAccordion />
        </div>
    </div>
}