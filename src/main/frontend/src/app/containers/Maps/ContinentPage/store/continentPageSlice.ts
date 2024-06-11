import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IContinentPageState } from "../types";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../services/openapi";
import { Page } from "../../../../../services/openapi/models/Page";

const initialState: IContinentPageState = {
    page: {
        currentPage: 1,
        totalPages: 1,
        data: new Array<EntryFullDTO>()
    }
}

interface IUpdateContinentPayload {
    id: number,
    entryDTO: EntryDTO
}

interface IAddDescriptionPayload {
    continentId: number,
    descriptionDTO: DescriptionDTO
}

interface IUpdateDescriptionPayload {
    continentId: number,
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

interface IAddImagePayload {
    continentId: number,
    imageDTO: ImageDTO
}

interface IAddNewSubObjectPayload {
    continentId: number,
    kingdomDTO: EntryDTO
}

interface IRemoveSubObjectPayload {
    continentId: number,
    subObjectId: number
}

interface ISetNewDomObjectPayload {
    continentId: number,
    planeDTO: EntryDTO
}

const continentPageSlice = createSlice({
    name: "ContinentPage",
    initialState,
    reducers: {
        setContinentPage(state, action: PayloadAction<Page<EntryFullDTO>>) {
            state.page.currentPage = action.payload.currentPage;
            state.page.totalPages = action.payload.totalPages;
            state.page.data = action.payload.data;
        },
        fillContinentData(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.splice(
                state.page.data?.findIndex((continent) => continent.object?.id === action.payload.object?.id),
                1,
                action.payload);
        },
        addContinent(state, action: PayloadAction<EntryFullDTO>) {
            state.page.data?.unshift(action.payload);
        },
        removeContinent(state, action: PayloadAction<number>) {
            console.log(action)
            state.page.data = state.page.data?.filter((continent) => continent.object?.id !== action.payload);
        },
        updateContinent(state, action: PayloadAction<IUpdateContinentPayload>) {
            console.log(action)
            state.page.data!.at(
                state.page.data!.findIndex((continent) => continent.object?.id === action.payload.id))!
                .object = action.payload.entryDTO;
        },

        addContinentDescription(state, action: PayloadAction<IAddDescriptionPayload>) {
            state.page.data?.at(
                state.page.data!.findIndex((continent) => continent.object?.id === action.payload.continentId))!
                .descriptions?.push(action.payload.descriptionDTO);
        },
        updateContinentDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.page.data!.at(state.page.data!.findIndex((continent) => continent.object?.id === action.payload.continentId))!.descriptions =
                state.page.data?.at(
                    state.page.data!.findIndex((continent) => continent.object?.id === action.payload.continentId))!
                    .descriptions?.map((description) => {
                        if (description.id === action.payload.descriptionId) {
                            return action.payload.descriptionDTO;
                        }
                        return description;
                    });
        },
        removeContinentDescription(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let descriptions = state.page.data?.at(state.page.data!.findIndex((continent) => continent.object?.id === action.payload.continentId))!.descriptions;
            state.page.data!.at(state.page.data!.findIndex((continent) => continent.object?.id === action.payload.continentId))!.descriptions = descriptions?.filter((description) => description.id !== action.payload.subObjectId);
        },

        addImageToContinent(state, action: PayloadAction<IAddImagePayload>) {
            state.page.data?.at(
                state.page.data.findIndex((continent) => continent.object?.id === action.payload.continentId))!
                .images?.push(action.payload.imageDTO);
        },
        removeImageFromContinent(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let images = state.page.data?.at(state.page.data.findIndex((continent) => continent.object?.id === action.payload.continentId))!.images;
            state.page.data!.at(state.page.data!.findIndex((continent) => continent.object?.id === action.payload.continentId))!.images = images?.filter((image) => image.id !== action.payload.subObjectId);
        },

        addNewKingdomToContinent(state, action: PayloadAction<IAddNewSubObjectPayload>) {
            state.page.data?.at(
                state.page.data.findIndex((continent) => continent.object?.id === action.payload.continentId))!
                .subObjects?.push(action.payload.kingdomDTO);
        },
        removeKingdomFromContinent(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            let subContinents = state.page.data!.find((continent) => continent.object?.id === action.payload.continentId)?.subObjects?.filter((kingdom) => kingdom.id !== action.payload.subObjectId);
            state.page.data!.find((continent) => continent.object?.id === action.payload.continentId)!.subObjects = subContinents;
        },

        setPlaneToContinent(state, action: PayloadAction<ISetNewDomObjectPayload>) {
            state.page.data!.find((continent) => continent.object?.id === action.payload.continentId)!.domObjects = action.payload.planeDTO;
        },
        removePlaneFromContinent(state, action: PayloadAction<IRemoveSubObjectPayload>) {
            state.page.data!.find((continent) => continent.object?.id === action.payload.continentId)!.domObjects = undefined;
        },
    }
}
)

export const { setContinentPage, fillContinentData, addContinent, removeContinent, updateContinent,
    addContinentDescription, updateContinentDescription, removeContinentDescription,
    addImageToContinent, removeImageFromContinent,
    addNewKingdomToContinent, removeKingdomFromContinent,
    setPlaneToContinent, removePlaneFromContinent } = continentPageSlice.actions;
export default continentPageSlice.reducer;