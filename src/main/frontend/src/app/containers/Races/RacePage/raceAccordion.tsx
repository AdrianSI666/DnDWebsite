import { Dispatch } from "@reduxjs/toolkit";
import { Accordion } from "react-bootstrap";
import { createSelector } from "reselect";
import { RaceControllerService, RaceDTO } from "../../../../services/openapi";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RaceAccordionBody } from "./raceAccordionBody";
import { fillRaceData } from "./store/racePageSlice";
import { makeSelectRacePage } from "./store/selector";

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
  const isEmptyPage = !page || !page.data || page.data.length === 0;
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

  if (isEmptyPage) return <div>Loading...</div>;
  return <div className='lightbox'>
    {page && page.data && page.data.map((raceDTO) => (
      <Accordion key={raceDTO.race?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + raceDTO.race?.id!} onClick={(_) => {
          if (raceDTO.images && raceDTO.subRaces) fetchRaceData(raceDTO.race?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{raceDTO.race?.name}</b></h5>
          </Accordion.Header>
          <RaceAccordionBody race={{
            object: raceDTO.race,
            images: raceDTO.images,
            domObjects: {},
            subObjects: raceDTO.subRaces
          }} regions={raceDTO.regions} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}