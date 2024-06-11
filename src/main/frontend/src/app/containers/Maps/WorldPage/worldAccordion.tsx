import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { EntryFullDTO, WorldControllerService } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { makeSelectWorldPage } from "./store/selector";
import { fillWorldData } from "./store/worldPageSlice";
import { WorldAccordionBody } from "./worldAccordionBody";
import { WorldFunction } from "./worldFunction";

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
  const isLoading = !page || page.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { fillWorldData } = actionDispatch(useAppDispatch());
  const { deleteWorld, editWorld } = WorldFunction();
  const fetchWorldData = async (name: string) => {
    WorldControllerService.getWorldByName(name)
      .then((response) => {
        fillWorldData(response);
      })
      .catch((err) => {
        console.log("My Error: ", err);
      });
  }

  if (isEmptyPage) return <div>No worlds created, yet.</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div className='lightbox'>
    {page && page.data && page.data.map((world) => (
      <AccordionHeaderLayout categoryName={"world"} updateEntry={editWorld}
        deleteEntry={deleteWorld} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={world} fetchFullValue={fetchWorldData} key={world.object?.id}>
        <WorldAccordionBody world={world} />
      </AccordionHeaderLayout>
    ))}
  </div>
}