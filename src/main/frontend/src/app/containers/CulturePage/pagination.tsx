import { CultureControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../services/openapi";
import { makeSelectCulturePage } from "./store/selector";
import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { setCulturePage } from "./store/culturePageSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Page } from "../../../services/openapi/models/Page";
import { Pagination } from "@mui/material";

interface IPaginationData {
    pageSize: number
}

const stateSelect = createSelector(makeSelectCulturePage, (page) => ({
    page
}))

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
    }
})

export function CulturePagination(props: IPaginationData) {
    const { page } = useAppSelector(stateSelect);
    const { setCulturePage } = actionDispatch(useAppDispatch());
    const changeCulturePage = async (event: React.ChangeEvent<unknown>, value: number) => {
        if(value !== page.currentPage){
            const pageInfo: PageInfo = {
                number: value,
                size: props.pageSize
            };
    
            CultureControllerService.getCultures(pageInfo)
                .then((response) => {
                    setCulturePage(response);
                })
                .catch((err) => {
                    console.log("My Error: ", err);
                });
        }
    }

    return <div className="d-flex justify-content-center">
        <Pagination
            className="my-3"
            color="primary"
            showFirstButton
            showLastButton
            count={page.totalPages}
            page={page.currentPage}
            siblingCount={3}
            boundaryCount={2}
            variant="outlined"
            shape="rounded"
            onChange={changeCulturePage}
        />
    </div>
}