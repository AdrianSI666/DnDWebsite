import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { SubCategoryBody } from "../../../components/accordions/subCategoryBody";
import { getAllRegions } from "../../../hookFunctions/RegionHooks";
import { useAppSelector } from "../../../hooks";
import { OneCultureSubObjectsFunction } from "./oneCultureSubObjectsFunction";
import { makeSelectOneCulture } from "./store/selector";
import { UseOneCultureFunction } from "./useOneCultureFunction";

interface IOneCultureProps {
}

const oneCultureSelect = createSelector(makeSelectOneCulture, (culture) => ({
    culture
}))

export function OneCulture(props: IOneCultureProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { culture } = useAppSelector(oneCultureSelect);
    const { fetchCulture, removeCulture, editCulture, saveImageToCulture, deleteImageFromCulture } = UseOneCultureFunction({ cultureId: culture.object?.id });
    const { saveNewRegionToCulture, saveExistingRegionToCulture, removeRegionFromCultureFunction } = OneCultureSubObjectsFunction();


    useEffect(() => {
        fetchCulture(name!).then((res) => setExist(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!exist) return <div>
        <h1>Culture named {name} doesn't exist.</h1>
    </div>;

    return <div>
        <div className="d-grid gap-2">
            <h1>Culture {name}</h1>
            <Accordion key={culture.object?.id} defaultActiveKey={['0']}>
                <Accordion.Item eventKey={'0'} className="borderFix" onClick={(e) => e.stopPropagation()}>
                    <Accordion.Header>
                        <h5><b>{culture.object?.name}</b></h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={culture}
                            deleteEntry={removeCulture}
                            updateEntry={editCulture}
                            saveImageToEntry={saveImageToCulture}
                            deleteImageFromEntry={deleteImageFromCulture}
                            deleteMainObjectButtonActionText={"Delete this culture"}
                            deleteImageButtonActionText={"Delete image"} />
                        <SubCategoryBody mainEntryId={culture.object?.id!}
                            subObjects={culture.subObjects}
                            subCategoryTitle={"Region"} subCategoryLink={"regions"}
                            fillTheListWithAllSubObjects={getAllRegions}
                            addNewSubEntryToRelation={saveNewRegionToCulture}
                            addExistingObjectToRelation={saveExistingRegionToCulture}
                            deleteSubObject={removeRegionFromCultureFunction}
                            addButtonActionText={"Add new region that use this culture"}
                            addExistingButtonActionText={"Link existing region from list to this culture"}
                            deleteButtonActionText={`Unlink this region from ${culture.object?.name}`}
                            subCategoryLinkText={"region"} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}