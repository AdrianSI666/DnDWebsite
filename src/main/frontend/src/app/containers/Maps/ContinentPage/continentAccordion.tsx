import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { ContinentControllerService, EntryFullDTO } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { ContinentAccordionBody } from "./continentAccordionBody";
import { ContinentFunction } from "./continentFunction";
import { fillContinentData } from "./store/continentPageSlice";
import { makeSelectContinentPage } from "./store/selector";

const stateContinentPageSelect = createSelector(makeSelectContinentPage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillContinentData: (data: EntryFullDTO) => {
    dispatch(fillContinentData(data))
  }
})

export function ContinentAccordion() {
  const { page } = useAppSelector(stateContinentPageSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillContinentData } = actionDispatch(useAppDispatch());
  const fetchContinentData = async (name: string) => {
    ContinentControllerService.getContinentByName(name)
      .then((response) => {
        fillContinentData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }
  const { deleteContinent, editContinent } = ContinentFunction();
  if (isEmptyPage) return <div>No continents created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div className='lightbox'>
    {page && page.data && page.data.map((continent) => (
      <AccordionHeaderLayout categoryName={"continent"} updateEntry={editContinent}
        deleteEntry={deleteContinent} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={continent} fetchFullValue={fetchContinentData} key={continent.object?.id}>
        <ContinentAccordionBody continent={continent} />
      </AccordionHeaderLayout>
    ))}
  </div>
}