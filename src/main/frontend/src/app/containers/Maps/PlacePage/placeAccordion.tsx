import { createSelector } from "reselect";
import { makeSelectPlacePage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { PlaceControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillPlaceData } from "./store/placePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { PlaceAccordionBody } from "./placeAccordionBody";
import { PlaceFunction } from "./function/placeFunction";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { PlaceDispatcher } from "./store/dispatcher";

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
  const { removePlace, updatePlace } = PlaceDispatcher();
  const { deletePlace, editPlace } = PlaceFunction({
    removePlace, updatePlace
  });
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
      <AccordionHeaderLayout categoryName={"place"} updateEntry={editPlace}
        deleteEntry={deletePlace} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={place} fetchFullValue={fetchPlaceData} key={place.object?.id}>
        <PlaceAccordionBody place={place} />
      </AccordionHeaderLayout>
    ))}
  </div>
}