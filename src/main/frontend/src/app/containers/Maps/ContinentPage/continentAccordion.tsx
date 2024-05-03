import { createSelector } from "reselect";
import { makeSelectContinentPage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Accordion } from "react-bootstrap";
import { ContinentControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillContinentData } from "./store/continentPageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { ContinentAccordionBody } from "./continentAccordionBody";

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

  if (isEmptyPage) return <div>No continents created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return <div className='lightbox'>
    {page && page.data && page.data.map((continent) => (
      <Accordion key={continent.object?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + continent.object?.id!} onClick={(_) => {
          if (continent.images && continent.domObjects && continent.subObjects) fetchContinentData(continent.object?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{continent.object?.name}</b></h5>
          </Accordion.Header>
          <ContinentAccordionBody continent={continent} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}