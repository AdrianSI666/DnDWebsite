
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { EntryFullDTO, PlaceControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { setPlace } from "./store/onePlaceSlice"

interface IUseOnePlaceObjectFunction {
    placeId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setPlace: (place: EntryFullDTO) => {
        dispatch(setPlace(place))
    }
})

export function UseOnePlaceObjectFunction(props: IUseOnePlaceObjectFunction) {
    const { setPlace } = actionDispatch(useAppDispatch());
    const navigate = useNavigate();
    const fetchPlace = async (name: string): Promise<boolean> => {
        return PlaceControllerService.getPlaceByName(name)
            .then((response) => {
                setPlace(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removePlace = async (id: number) => {
        return PlaceControllerService.deletePlace(id)
            .then((_) => {
                navigate("/Places")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchPlace, removePlace };
}