
import { useNavigate } from "react-router-dom"
import { PlaceControllerService } from "../../../../../services/openapi"
import { OnePlaceDispatcher } from "./store/dispatcher"

export function UseOnePlaceObjectFunction() {
    const { setPlace } = OnePlaceDispatcher();
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