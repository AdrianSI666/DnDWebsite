import { useEffect, useState } from "react";
import { ApiError, CultureControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../services/openapi";
import { Dispatch } from "@reduxjs/toolkit";
import { addCulture, setCulturePage } from "./store/culturePageSlice";
import { useAppDispatch } from "../../hooks";
import { Page } from "../../../services/openapi/models/Page";
import { CultureAccordion } from "./cultureAccordion";
import { useParams } from "react-router-dom";
import { CulturePagination } from "./pagination";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";

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

export function CulturePage(props: ICulturePageProps) {
    let { name, subname } = useParams();
    console.log(name);
    console.log(subname);
    const [pageSize, setPageSize] = useState(10);
    const { setCulturePage, addCulture } = actionDispatch(useAppDispatch());
    const fetchCulturePage = async () => {
        const pageInfo: PageInfo = {
            number: 1,
            size: pageSize
        };

        CultureControllerService.getCultures(pageInfo)
            .then((response) => {
                setCulturePage(response);
            })
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const saveCulture = async (name: string, description: string):Promise<void> =>  {
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

    useEffect(() => {
        fetchCulturePage();
    }, [])

    return <div>
        <div className="d-grid gap-2">
            <h1>Cultures</h1>
            <AddNewEntryModal addFunction={saveCulture} categoryName="Culture" />
            <CultureAccordion />
            <CulturePagination pageSize={pageSize} />
        </div>
    </div>
}