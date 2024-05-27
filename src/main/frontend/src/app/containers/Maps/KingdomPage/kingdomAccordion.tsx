import { createSelector } from "reselect";
import { makeSelectKingdomPage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Accordion } from "react-bootstrap";
import { KingdomControllerService, EntryFullDTO } from "../../../../services/openapi";
import { fillKingdomData } from "./store/kingdomPageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { KingdomAccordionBody } from "./kingdomAccordionBody";

const stateKingdomPageSelect = createSelector(makeSelectKingdomPage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillKingdomData: (data: EntryFullDTO) => {
    dispatch(fillKingdomData(data))
  }
})

export function KingdomAccordion() {
  const { page } = useAppSelector(stateKingdomPageSelect);
  const isLoading = !page || page?.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillKingdomData } = actionDispatch(useAppDispatch());
  const fetchKingdomData = async (name: string) => {
    KingdomControllerService.getKingdomByName(name)
      .then((response) => {
        fillKingdomData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  if (isEmptyPage) return <div>No kingdoms created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return <div className='lightbox'>
    {page && page.data && page.data.map((kingdom) => (
      <Accordion key={kingdom.object?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + kingdom.object?.id!} onClick={(_) => {
          if (kingdom.images && kingdom.domObjects && kingdom.subObjects) fetchKingdomData(kingdom.object?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{kingdom.object?.name}</b></h5>
          </Accordion.Header>
          <KingdomAccordionBody kingdom={kingdom} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}