import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError, RaceControllerService, EntryDTO, EntryFullDTO, ImageDTO, RaceSubRaceControllerService } from "../../../../services/openapi";
import { FullEntryAccordionBody } from "../../../components/accordions/fullEntryAccordionBody";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addImageToRace, addNewSubRaceToRace, removeImageFromRace, removeSubRaceFromRace, setRace, updateRace } from "./store/oneRaceSlice";
import { makeSelectOneRace } from "./store/selector";

interface IOneRaceProps {
}

const actionDispatch = (dispatch: Dispatch) => ({
    setRace: (Race: EntryFullDTO) => {
        dispatch(setRace(Race))
    },
    updateRace: (Race: EntryDTO) => {
        dispatch(updateRace(Race))
    },
    addImageToRace: (imageDTO: ImageDTO) => {
        dispatch(addImageToRace(imageDTO))
    },
    removeImageFromRace: (imageId: number) => {
        dispatch(removeImageFromRace(imageId))
    },
    addNewSubRaceToRace: (subRaceDTO: EntryDTO) => {
        dispatch(addNewSubRaceToRace(subRaceDTO))
    },
    removeSubRaceFromRace: (subRaceId: number) => {
        dispatch(removeSubRaceFromRace(subRaceId))
    }
})

const oneRaceSelect = createSelector(makeSelectOneRace, (raceDTO) => ({
    raceDTO
}))
//Test v2
export function OneRace(props: IOneRaceProps) {
    let { name } = useParams();
    const [exist, setExist] = useState(false);
    const { raceDTO } = useAppSelector(oneRaceSelect);
    const { setRace, addImageToRace, removeImageFromRace, updateRace, addNewSubRaceToRace, removeSubRaceFromRace } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchRace = async (name: string) => {
        RaceControllerService.getRaceByName(name)
            .then((response) => {
                setRace(response);
                setExist(true)
            })
            .catch((_) => {
                setExist(false)
            });
    }

    const removeRace = async (id: number) => {
        return RaceControllerService.deleteRace(id)
            .then((_) => {
                navigate("/Races")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const editRace = async (id: number, name: string, description: string) => {
        let entryDTO: EntryDTO = {
            id: id,
            name: name,
            description: description
        }
        return RaceControllerService.updateRace(id, entryDTO)
            .then((_) => {
                updateRace(entryDTO)
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveImageToRace = async (acceptedFiles: Blob) => {
        return RaceControllerService.saveImageToRace(raceDTO.race?.id!, { image: acceptedFiles })
            .then((res) => addImageToRace(res))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const deleteImageFromRace = async (raceId: number, imageId: number) => {
        return RaceControllerService.deleteImageFromRace(raceId, imageId)
            .then(() => removeImageFromRace(imageId))
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveNewSubRaceToRace = async (raceId: number, name: string, description: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: name,
            description: description
        }
        return RaceSubRaceControllerService.addNewSubRaceRelation1(raceId, entryDTO)
            .then((res) => {
                addNewSubRaceToRace(res);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    const saveExistingSubRaceToRace = async (raceId: number, subRaceId: number, subRaceName: string, subRaceDescription: string): Promise<void> => {
        let entryDTO: EntryDTO = {
            name: subRaceName,
            description: subRaceDescription,
            id: subRaceId
        }
        return RaceSubRaceControllerService.addSubRaceRelationRace(raceId, subRaceId)
            .then(() => {
                addNewSubRaceToRace(entryDTO);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err.body);
                throw err
            });
    }

    const getAllSubRacesWithoutRace = async () => {
        return await RaceSubRaceControllerService.getSubRacesWithoutRace()
            .catch((err) => {
                console.log("My Error: ", err);
            });
    }

    const removeSubRaceFromRaceFunction = async (raceId: number, subRaceId: number): Promise<void> => {
        return RaceSubRaceControllerService.removeSubRaceRelationRace(raceId, subRaceId)
            .then(() => {
                removeSubRaceFromRace(subRaceId);
            })
            .catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    useEffect(() => {
        fetchRace(name!);
    })

    if (!exist) return <div>
        <h1>Race named {name} doesn't exist.</h1>
    </div>;

    return <div>
        <div className="d-grid gap-2">
            <h1>Race {name}</h1>
            <Accordion key={raceDTO.race?.id} defaultActiveKey={['0']}>
                <Accordion.Item eventKey={'0'} className="borderFix" onClick={(e) => e.stopPropagation()}>
                    <Accordion.Header>
                        <h5><b>{raceDTO.race?.name}</b></h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <FullEntryAccordionBody categoryName={"Race"} entryFullDTO={{
                            object: raceDTO.race,
                            images: raceDTO.images,
                            domObjects: {},
                            subObjects: raceDTO.subRaces
                        }}
                            deleteEntry={removeRace}
                            updateEntry={editRace}
                            saveImageToEntry={saveImageToRace}
                            deleteImageFromEntry={deleteImageFromRace}
                            subCategoryName={"Sub Race"} subCategoryLink={"subRaces"}
                            fillTheListWithAllSubObjects={getAllSubRacesWithoutRace}
                            addNewSubEntryToRelation={saveNewSubRaceToRace}
                            addExistingObjectToRelation={saveExistingSubRaceToRace}
                            deleteSubObject={removeSubRaceFromRaceFunction} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>
}