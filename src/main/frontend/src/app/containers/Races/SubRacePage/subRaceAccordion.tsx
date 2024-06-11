import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { SubRaceControllerService, SubRaceDTO } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { makeSelectSubRacePage } from "./store/selector";
import { fillSubRaceData } from "./store/subRacePageSlice";
import { SubRaceAccordionBody } from "./subRaceAccordionBody";
import { SubRaceFunction } from "./subRaceFunction";

const stateSelect = createSelector(makeSelectSubRacePage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillSubRaceData: (SubRace: SubRaceDTO) => {
    dispatch(fillSubRaceData(SubRace))
  }
})

export function SubRaceAccordion() {
  const { page } = useAppSelector(stateSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillSubRaceData } = actionDispatch(useAppDispatch());
  const fetchSubRaceData = async (name: string) => {
    SubRaceControllerService.getSubRaceByName(name)
      .then((response) => {
        console.log(response)
        fillSubRaceData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const { editSubRace, deleteSubRace } = SubRaceFunction();
  
  if (isEmptyPage) return <div>No sub race created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div className='lightbox'>
    {page && page.data && page.data.map((subRaceDTO) => (
      <AccordionHeaderLayout categoryName={"subrace"} updateEntry={editSubRace}
        deleteEntry={deleteSubRace} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={{
          object: subRaceDTO.subRace,
          images: subRaceDTO.images,
          domObjects: subRaceDTO.race,
          subObjects: subRaceDTO.regions,
          descriptions: subRaceDTO.descriptions
        }} fetchFullValue={fetchSubRaceData} key={subRaceDTO.subRace?.id}>
        <SubRaceAccordionBody subRace={{
          object: subRaceDTO.subRace,
          images: subRaceDTO.images,
          domObjects: subRaceDTO.race,
          subObjects: subRaceDTO.regions,
          descriptions: subRaceDTO.descriptions
        }} />
      </AccordionHeaderLayout>
    ))}
  </div>
}