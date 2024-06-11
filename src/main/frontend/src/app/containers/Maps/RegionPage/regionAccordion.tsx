import { createSelector } from "reselect";
import { makeSelectRegionPage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RegionControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillRegionData } from "./store/regionPageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { RegionAccordionBody } from "./regionAccordionBody";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { RegionFunction } from "./function/regionFunction";
import { RegionsDispatcher } from "./store/dispatcher";

const stateRegionPageSelect = createSelector(makeSelectRegionPage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillRegionData: (data: EntryFullDTO) => {
    dispatch(fillRegionData(data))
  }
})

export function RegionAccordion() {
  const { page } = useAppSelector(stateRegionPageSelect);
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillRegionData } = actionDispatch(useAppDispatch());
  const { removeRegion, updateRegion } = RegionsDispatcher();

  const fetchRegionData = async (name: string) => {
    RegionControllerService.getRegionByName(name)
      .then((response) => {
        fillRegionData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }
  const { deleteRegion, editRegion } = RegionFunction({
    removeRegion, updateRegion
  });

  if (isEmptyPage) return <div>No regions created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div className='lightbox'>
    {page && page.data && page.data.map((region) => (
      <AccordionHeaderLayout categoryName={"region"} updateEntry={editRegion}
        deleteEntry={deleteRegion} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={{
          object: region.region,
          images: region.images,
          domObjects: region.kingdom,
          subObjects: region.places,
          descriptions: region.descriptions
        }} fetchFullValue={fetchRegionData} key={region.region?.id}>
        <RegionAccordionBody region={region} />
      </AccordionHeaderLayout>
    ))}
  </div>
}