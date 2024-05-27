
import { Dispatch } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { EntryFullDTO, KingdomControllerService } from "../../../../../services/openapi"
import { useAppDispatch } from "../../../../hooks"
import { setKingdom } from "./store/oneKingdomSlice"

interface IUseOneKingdomObjectFunction {
    kingdomId?: number
}

const actionDispatch = (dispatch: Dispatch) => ({
    setKingdom: (kingdom: EntryFullDTO) => {
        dispatch(setKingdom(kingdom))
    },
})

export function UseOneKingdomObjectFunction(props: IUseOneKingdomObjectFunction) {
    const { setKingdom } = actionDispatch(useAppDispatch());
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