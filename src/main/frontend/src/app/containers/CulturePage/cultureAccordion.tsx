import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { CultureControllerService, EntryFullDTO } from "../../../services/openapi";
import { AccordionHeaderLayout } from "../../components/accordions/accordionHeaderLayout";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { CultureAccordionBody } from "./cultureAccordionBody";
import { CultureFunction } from "./cultureFunction";
import { fillCultureData } from "./store/culturePageSlice";
import { makeSelectCulturePage } from "./store/selector";

const stateCulturePageSelect = createSelector(makeSelectCulturePage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillCultureData: (data: EntryFullDTO) => {
    dispatch(fillCultureData(data))
  }
})

export function CultureAccordion() {
  const { page } = useAppSelector(stateCulturePageSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillCultureData } = actionDispatch(useAppDispatch());
  const fetchCultureData = async (name: string) => {
    CultureControllerService.getCultureByName(name)
      .then((response) => {
        fillCultureData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }
  
  const { editCulture, deleteCulture } = CultureFunction();

  if (isEmptyPage) return <div>No culture created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div className='lightbox'>
    {page && page.data && page.data.map((culture) => (
      <AccordionHeaderLayout categoryName={"culture"} updateEntry={editCulture}
      deleteEntry={deleteCulture} deleteMainObjectButtonActionText={"Delete"}
      entryFullDTO={culture} fetchFullValue={fetchCultureData} key={culture.object?.id}>
        <CultureAccordionBody culture={culture} />
      </AccordionHeaderLayout>
    ))}
  </div>
}