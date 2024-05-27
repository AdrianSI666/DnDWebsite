import { createSelector } from "reselect";
import { makeSelectPlanePage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Accordion } from "react-bootstrap";
import { PlaneControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillPlaneData } from "./store/planePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { PlaneAccordionBody } from "./planeAccordionBody";

const statePlanePageSelect = createSelector(makeSelectPlanePage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillPlaneData: (data: EntryFullDTO) => {
    dispatch(fillPlaneData(data))
  }
})

export function PlaneAccordion() {
  const { page } = useAppSelector(statePlanePageSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillPlaneData } = actionDispatch(useAppDispatch());
  const fetchPlaneData = async (name: string) => {
    PlaneControllerService.getPlaneByName(name)
      .then((response) => {
        fillPlaneData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  if (isEmptyPage) return <div>No planes created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return <div className='lightbox'>
    {page && page.data && page.data.map((plane) => (
      <Accordion key={plane.object?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + plane.object?.id!} onClick={(_) => {
          if (plane.images && plane.domObjects && plane.subObjects) fetchPlaneData(plane.object?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{plane.object?.name}</b></h5>
          </Accordion.Header>
          <PlaneAccordionBody plane={plane} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}