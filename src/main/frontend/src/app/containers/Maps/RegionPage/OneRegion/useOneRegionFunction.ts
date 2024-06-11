
import { useNavigate } from "react-router-dom";
import { RegionControllerService } from "../../../../../services/openapi";
import { OneRegionDispatcher } from "./store/dispatcher";

export function UseOneRegionFunction() {
    const { setRegion } = OneRegionDispatcher();
    const navigate = useNavigate();
    const fetchRegion = async (name: string): Promise<boolean> => {
        console.log(name)
        return RegionControllerService.getRegionByName(name)
            .then((response) => {
                setRegion(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeRegion = async (id: number) => {
        return RegionControllerService.deleteRegion(id)
            .then((_) => {
                navigate("/Regions")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchRegion, removeRegion };
}