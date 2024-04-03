import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError, CultureControllerService, EntryDTO, EntryFullDTO, ImageDTO, RegionControllerService, RegionCultureControllerService } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addImageToCulture, addNewRegionToCulture, removeImageFromCulture, removeRegionFromCulture, setCulture, updateCulture } from "./store/oneCultureSlice";
import { makeSelectOneCulture } from "./store/selector";

interface IOneCultureProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setCulture: (culture: EntryFullDTO) => {
        dispatch(setCulture(culture))
    },
    updateCulture: (culture: EntryDTO) => {
        dispatch(updateCulture(culture))
    },
    addImageToCulture: (imageDTO: ImageDTO) => {
        dispatch(addImageToCulture(imageDTO))
    },
    removeImageFromCulture: (imageId: number) => {
        dispatch(removeImageFromCulture(imageId))
    },
    addNewRegionToCulture: (regionDTO: EntryDTO) => {
        dispatch(addNewRegionToCulture(regionDTO))
    },
    removeRegionFromCulture: (regionId: number) => {
        dispatch(removeRegionFromCulture(regionId))
    }
})

const oneCultureSelect = createSelector(makeSelectOneCulture, (culture) => ({
    culture
}))

export function OneCulture(props: IOneCultureProps) {
    let { name } = useParams();
    const [ exist, setExist ] = useState(false);
    const { culture } = useAppSelector(oneCultureSelect);
    const { setCulture, addImageToCulture, removeImageFromCulture, updateCulture, addNewRegionToCulture, removeRegionFromCulture } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchCulture = async (name: string) => {
        CultureControllerService.getCultureByName(name)
            .then((response) => {
                setCulture(response);
                setExist(true)
            })
            .catch((err) => {
                setExist(false)
            });
    }

    const removeCulture = async (id: number) => {
        return CultureControllerService.deleteCulture(id)
            .then((_) => {
                navigate("/cultures")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editCulture = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return CultureControllerService.updateCulture(id, entryDTO)
            .then((_) => {
                updateCulture(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToCulture = async (acceptedFiles: Blob) => {
        return CultureControllerService.saveImageToCulture(culture.object?.id!, { image: acceptedFiles })
            .then((res) => addImageToCulture(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromCulture = async (cultureId: number, imageId: number) => {
        return CultureControllerService.deleteImageFromCulture(cultureId, imageId)
            .then(() => removeImageFromCulture(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveNewRegionToCulture = async (cultureId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RegionCultureControllerService.addNewRegionCultureRegion(cultureId, entryDTO)
            .then((result) => {
                addNewRegionToCulture(result);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingRegionToCulture = async (cultureId: number, regionId: number, regionName: string, regionDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: regionName,
            description: regionDescription,
            id: regionId
        }
        return RegionCultureControllerService.addCultureRegionRelation(regionId, cultureId)
            .then(() => {
                addNewRegionToCulture(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllRegions = async () => {
        return await RegionControllerService.getAllRegions()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeRegionFromCultureFunction = async (cultureId: number, regionId: number): Promise<void> => {
        return RegionCultureControllerService.deleteCulture(regionId, cultureId)
            .then(() => {
                removeRegionFromCulture(regionId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    useEffect(() => {
        fetchCulture(name!);
    })

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
                    <FullEntryAccordionBody categoryName={"culture"} entryFullDTO={culture}
                        deleteEntry={removeCulture}
                        updateEntry={editCulture}
                        saveImageToEntry={saveImageToCulture}
                        deleteImageFromEntry={deleteImageFromCulture}
                        subCategoryName={"Regions"} subCategoryLink={"regions"}
                        fillTheListWithAllSubObjects={getAllRegions}
                        addNewSubEntryToRelation={saveNewRegionToCulture}
                        addExistingObjectToRelation={saveExistingRegionToCulture}
                        deleteSubObject={removeRegionFromCultureFunction} />
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}