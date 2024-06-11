import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RaceControllerService, RaceDTO } from "../../../../services/openapi";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RaceAccordionBody } from "./raceAccordionBody";
import { fillRaceData } from "./store/racePageSlice";
import { makeSelectRacePage } from "./store/selector";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { RaceFunction } from "./raceFunction";

const stateSelect = createSelector(makeSelectRacePage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillRaceData: (race: RaceDTO) => {
    dispatch(fillRaceData(race))
  }
})

export function RaceAccordion() {
  const { page } = useAppSelector(stateSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillRaceData } = actionDispatch(useAppDispatch());
  const fetchRaceData = async (name: string) => {
    RaceControllerService.getRaceByName(name)
      .then((response) => {
        fillRaceData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  const { editRace, deleteRace } = RaceFunction();

  if (isEmptyPage) return <div>No race created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div className='lightbox'>
    {page && page.data && page.data.map((raceDTO) => (
      <AccordionHeaderLayout categoryName={"race"} updateEntry={editRace}
        deleteEntry={deleteRace} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={{
          object: raceDTO.race,
          images: raceDTO.images,
          domObjects: {},
          subObjects: raceDTO.subRaces,
          descriptions: raceDTO.descriptions
          }} fetchFullValue={fetchRaceData} key={raceDTO.race?.id}>
        <RaceAccordionBody race={{
          object: raceDTO.race,
          images: raceDTO.images,
          domObjects: {},
          subObjects: raceDTO.subRaces,
          descriptions: raceDTO.descriptions
        }} regions={raceDTO.regions} />
      </AccordionHeaderLayout>
    ))}
  </div>
}