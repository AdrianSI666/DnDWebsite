import { createSelector } from "reselect";
import { KingdomControllerService } from "../../../../services/openapi";
import { AccordionHeaderLayout } from "../../../components/accordions/accordionHeaderLayout";
import { useAppSelector } from "../../../hooks";
import { KingdomFunction } from "./function/kingdomFunction";
import { KingdomAccordionBody } from "./kingdomAccordionBody";
import { KingdomsDispatcher } from "./store/dispatcher";
import { makeSelectKingdomPage } from "./store/selector";

const stateKingdomPageSelect = createSelector(makeSelectKingdomPage, (page) => ({
  page
}))

export function KingdomAccordion() {
  const { page } = useAppSelector(stateKingdomPageSelect);
  const isLoading = !page || page?.data === undefined
  const isEmptyPage = page.data?.length === 0
  const { removeKingdom, updateKingdom, fillKingdomData } = KingdomsDispatcher();
  const { deleteKingdom, editKingdom, } = KingdomFunction({
    removeKingdom, updateKingdom
  });
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
      <AccordionHeaderLayout categoryName={"kingdom"} updateEntry={editKingdom}
        deleteEntry={deleteKingdom} deleteMainObjectButtonActionText={"Delete"}
        entryFullDTO={kingdom} fetchFullValue={fetchKingdomData} key={kingdom.object?.id}>
        <KingdomAccordionBody kingdom={kingdom} />
      </AccordionHeaderLayout>
    ))}
  </div>
}