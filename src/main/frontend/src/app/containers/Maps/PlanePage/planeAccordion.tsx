import { createSelector } from "reselect";
import { makeSelectPlanePage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { PlaneControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillPlaneData } from "./store/planePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { PlaneAccordionBody } from "./planeAccordionBody";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { PlaneFunction } from "./planeFunction";

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
  const { deletePlane, editPlane } = PlaneFunction();
  if (isEmptyPage) return <div>No planes created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div className='lightbox'>
    {page && page.data && page.data.map((plane) => (
      <AccordionHeaderLayout categoryName={"plane"} updateEntry={editPlane}
        deleteEntry={deletePlane} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={plane} fetchFullValue={fetchPlaneData} key={plane.object?.id}>
        <PlaneAccordionBody plane={plane} />
      </AccordionHeaderLayout>
    ))}
  </div>
}