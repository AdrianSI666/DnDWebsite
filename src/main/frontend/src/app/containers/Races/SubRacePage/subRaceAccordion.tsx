import { Dispatch } from "@reduxjs/toolkit";
import { Accordion } from "react-bootstrap";
import { createSelector } from "reselect";
import { SubRaceControllerService, SubRaceDTO } from "../../../../services/openapi";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { SubRaceAccordionBody } from "./subRaceAccordionBody";
import { fillSubRaceData } from "./store/subRacePageSlice";
import { makeSelectSubRacePage } from "./store/selector";

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
  const isLoading = !page || page.data  === undefined
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

  if (isEmptyPage) return <div>No sub race created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div className='lightbox'>
    {page && page.data && page.data.map((subRaceDTO) => (
      <Accordion key={subRaceDTO.subRace?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + subRaceDTO.subRace?.id!} onClick={(_) => {
          if (subRaceDTO.images && subRaceDTO.race) fetchSubRaceData(subRaceDTO.subRace?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{subRaceDTO.subRace?.name}</b></h5>
          </Accordion.Header>
          <SubRaceAccordionBody subRace={{
            object: subRaceDTO.subRace,
            images: subRaceDTO.images,
            domObjects: subRaceDTO.race,
            subObjects: subRaceDTO.regions
          }} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}