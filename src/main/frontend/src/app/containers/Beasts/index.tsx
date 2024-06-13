import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, BeastControllerService, BeastDTO, CultureControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { BeastAccordion } from "./beastAccordion";
import { BeastAccordionBody } from "./beastAccordionBody";
import { addBeast, setBeastPage } from "./store/beastPageSlice";
import { makeSelectBeastPage } from "./store/selector";

interface IBeastPageProps{
}



    const actionDispatch = (dispatch: Dispatch) => ({
        setBeastPage: (page: Page<EntryDTO>) => {
            let fullPage: Page<BeastDTO> = {
                data: page.data?.map((BeastDTO) => {
                    let entryFullDTO: BeastDTO = {
                        beast: BeastDTO,
                        images: [],
                        regions: [],
                        description: []
                    }
                    return entryFullDTO
                }),
                currentPage: page.currentPage,
                totalPages: page.totalPages
            }
            dispatch(setBeastPage(fullPage))
        },
        addBeast: (beast: EntryDTO) => {
            let entryFullDTO: BeastDTO = {
                beast: beast,
                images: [],
                regions: [],
                description: []
            }
            dispatch(addBeast(entryFullDTO))
        }
    })
    
    const stateSelect = createSelector(makeSelectBeastPage, (page) => ({
        page
    }))
    
    export function BeastPage(props: IBeastPageProps) {
        const [pageSize, setPageSize] = useState(0);
        const { page } = useAppSelector(stateSelect);
        const { setBeastPage, addBeast } = actionDispatch(useAppDispatch());
    
        const saveBeast = async (name: string, shortDescription: string): Promise<void> => {
            return BeastControllerService.saveBeast({
                name,
                shortDescription
            })
                .then((response) => {
                    addBeast(response);
                })
                .catch((err: ApiError) => {
                    console.log("My Error: ", err);
                    throw err
                });
        }
    
        const changeBeastPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
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
                BeastControllerService.getBeasts(pageInfo)
                    .then((response) => {
                        setBeastPage(response);
                    })
                    .catch((err) => {
                        console.log("My Error: ", err);
                    });
            }
        }
    
        useEffect(() => {
            changeBeastPage(undefined, 1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    
    return <div>
        <div className="d-grid gap-2">
            <h1>Beasts</h1>
            <AddNewEntryModal addNewEntry={saveBeast} addButtonActionText={"Create new beast"} />
            <CustomPagination pageSize={pageSize} changePage={changeBeastPage} page={page} />
            <BeastAccordion />
        </div>
    </div>
}