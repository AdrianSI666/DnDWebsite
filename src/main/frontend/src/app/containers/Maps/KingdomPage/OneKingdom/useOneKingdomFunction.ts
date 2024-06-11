
import { useNavigate } from "react-router-dom"
import { KingdomControllerService } from "../../../../../services/openapi"
import { OneKingdomDispatcher } from "./store/dispatcher"

export function UseOneKingdomObjectFunction() {
    const { setKingdom } = OneKingdomDispatcher();
    const navigate = useNavigate();
    const fetchKingdom = async (name: string): Promise<boolean> => {
        return KingdomControllerService.getKingdomByName(name)
            .then((response) => {
                setKingdom(response)
                return true
            })
            .catch((_) => {
                return false
            })
    }

    const removeKingdom = async (id: number) => {
        return KingdomControllerService.deleteKingdom(id)
            .then((_) => {
                navigate("/Kingdoms")
            })
            .catch((err) => {
                console.log("My Error: ", err);
                throw err
            });
    }

    return { fetchKingdom, removeKingdom };
}