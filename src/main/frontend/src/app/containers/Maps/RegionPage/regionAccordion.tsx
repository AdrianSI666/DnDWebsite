import { createSelector } from "reselect";
import { makeSelectRegionPage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Accordion } from "react-bootstrap";
import { RegionControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillRegionData } from "./store/regionPageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { RegionAccordionBody } from "./regionAccordionBody";

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
  const fetchRegionData = async (name: string) => {
    RegionControllerService.getRegionByName(name)
      .then((response) => {
        fillRegionData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  if (isEmptyPage) return <div>No regions created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return <div className='lightbox'>
    {page && page.data && page.data.map((region) => (
      <Accordion key={region.region?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + region.region?.id!} onClick={(_) => {
          if (region.images && region.kingdom && region.places) fetchRegionData(region.region?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{region.region?.name}</b></h5>
          </Accordion.Header>
          <RegionAccordionBody region={region} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}