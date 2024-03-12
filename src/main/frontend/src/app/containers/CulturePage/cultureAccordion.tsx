import { createSelector } from "reselect";
import { makeSelectCulturePage } from "./store/selector";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Accordion } from "react-bootstrap";
import { CultureControllerService } from "../../../services/openapi";
import { EntryFullDTO } from "../../../services/openapi";
import { fillCultureData } from "./store/culturePageSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { CultureAccordionBody } from "./cultureAccodrionBody";

const stateSelect = createSelector(makeSelectCulturePage, (page) => ({
  page
}))

const actionDispatch = (dispatch: Dispatch) => ({
  fillCultureData: (data: EntryFullDTO) => {
    dispatch(fillCultureData(data))
  }
})

export function CultureAccordion() {
  const { page } = useAppSelector(stateSelect);
  const isEmptyPage = !page || !page.data || page.data.length === 0;
  const { fillCultureData } = actionDispatch(useAppDispatch());
  const fetchCultureData = async (name: string) => {
    CultureControllerService.getCultureByName(name)
      .then((response) => {
        fillCultureData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  if (isEmptyPage) return <div>Loading...</div>;

  return <div className='lightbox'>
    {page && page.data && page.data.map((culture) => (
      <Accordion key={culture.object?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + culture.object?.id!} onClick={(_) => {
          if (culture.images && culture.domObjects && culture.subObjects) fetchCultureData(culture.object?.name!)
        }} className="borderFix">
          <Accordion.Header>
            <h5><b>{culture.object?.name}</b></h5>
          </Accordion.Header>
          <CultureAccordionBody culture={culture} />
        </Accordion.Item>
      </Accordion>
    ))}
  </div>
}