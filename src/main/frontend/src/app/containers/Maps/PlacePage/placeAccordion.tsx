import { createSelector } from "reselect";
import { makeSelectPlacePage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Accordion } from "react-bootstrap";
import { PlaceControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillPlaceData } from "./store/placePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { PlaceAccordionBody } from "./placeAccordionBody";

const statePlacePageSelect = createSelector(makeSelectPlacePage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillPlaceData: (data: EntryFullDTO) => {
    dispatch(fillPlaceData(data))
  }
})

export function PlaceAccordion() {
  const { page } = useAppSelector(statePlacePageSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillPlaceData } = actionDispatch(useAppDispatch());
  const fetchPlaceData = async (name: string) => {
    PlaceControllerService.getPlaceByName(name)
      .then((response) => {
        fillPlaceData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  if (isEmptyPage) return <div>No places created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return <div className='lightbox'>
    {page && page.data && page.data.map((place) => (
      <Accordion key={place.object?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + place.object?.id!} onClick={(_) => {
          if (place.images && place.domObjects && place.subObjects) fetchPlaceData(place.object?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{place.object?.name}</b></h5>
          </Accordion.Header>
          <PlaceAccordionBody place={place} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}