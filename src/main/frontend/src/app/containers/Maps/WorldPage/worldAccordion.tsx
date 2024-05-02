import { createSelector } from "reselect";
import { makeSelectWorldPage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Accordion } from "react-bootstrap";
import { WorldControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillWorldData } from "./store/worldPageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { WorldAccordionBody } from "./worldAccordionBody";

const stateWorldPageSelect = createSelector(makeSelectWorldPage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillWorldData: (data: EntryFullDTO) => {
    dispatch(fillWorldData(data))
  }
})

export function WorldAccordion() {
  const { page } = useAppSelector(stateWorldPageSelect);
  const isEmptyPage = !page || !page.data || page.data.length === 0;
  const { fillWorldData } = actionDispatch(useAppDispatch());
  const fetchWorldData = async (name: string) => {
    WorldControllerService.getWorldByName(name)
      .then((response) => {
        fillWorldData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  if (isEmptyPage) return <div>Loading...</div>;

  return <div className='lightbox'>
    {page && page.data && page.data.map((world) => (
      <Accordion key={world.object?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + world.object?.id!} onClick={(_) => {
          if (world.images && world.domObjects && world.subObjects) fetchWorldData(world.object?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{world.object?.name}</b></h5>
          </Accordion.Header>
          <WorldAccordionBody world={world} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}