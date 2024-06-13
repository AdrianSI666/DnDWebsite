import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { BeastControllerService, BeastDTO } from "../../../services/openapi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { BeastAccordionBody } from "./beastAccordionBody";
import { fillBeastData } from "./store/beastPageSlice";
import { makeSelectBeastPage } from "./store/selector";
import { AccordionHeaderLayout } from "../../components/accordions/accordionHeaderLayout";
import { BeastFunction } from "./beastFunction";

const stateSelect = createSelector(makeSelectBeastPage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillRaceData: (beast: BeastDTO) => {
    dispatch(fillBeastData(beast))
  }
})

export function BeastAccordion() {
  const { page } = useAppSelector(stateSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillRaceData } = actionDispatch(useAppDispatch());
  const fetchRaceData = async (name: string) => {
    BeastControllerService.getBeastByName(name)
      .then((response) => {
        fillRaceData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const { editBeast, deleteBeast } = BeastFunction();

  if (isEmptyPage) return <div>No beast created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div className='lightbox'>
    {page && page.data && page.data.map((beastDTO) => (
      <AccordionHeaderLayout categoryName={"beast"} updateEntry={editBeast}
        deleteEntry={deleteBeast} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={{
          object: beastDTO.beast,
          images: beastDTO.images,
          domObjects: {},
          subObjects: beastDTO.regions,
          descriptions: beastDTO.description
          }} fetchFullValue={fetchRaceData} key={beastDTO.beast?.id}>
        <BeastAccordionBody beast={{
          object: beastDTO.beast,
          images: beastDTO.images,
          domObjects: {},
          descriptions: beastDTO.description
        }} regions={beastDTO.regions} />
      </AccordionHeaderLayout>
    ))}
  </div>
}