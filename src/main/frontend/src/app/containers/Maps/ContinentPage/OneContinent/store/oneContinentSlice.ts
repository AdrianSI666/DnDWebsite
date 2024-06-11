import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DescriptionDTO, EntryDTO, EntryFullDTO, ImageDTO } from "../../../../../../services/openapi";
import { IOneContinentState } from "../../types";

const initialState: IOneContinentState = {
    continent: {
        object: {},
        domObjects: {},
        subObjects: new Array<EntryDTO>(),
        images: new Array<ImageDTO>()
    }
}

interface IUpdateDescriptionPayload {
    descriptionId: number,
    descriptionDTO: DescriptionDTO
}

const OneContinentSlice = createSlice({
    name: "oneContinent",
    initialState,
    reducers: {
        setContinent(state, action: PayloadAction<EntryFullDTO>) {
            state.continent = action.payload;
        },
        updateContinent(state, action: PayloadAction<EntryDTO>) {
            state.continent.object = action.payload;
        },

        addContinentDescription(state, action: PayloadAction<DescriptionDTO>) {
            state.continent.descriptions?.push(action.payload);
        },
        updateContinentDescription(state, action: PayloadAction<IUpdateDescriptionPayload>) {
            state.continent.descriptions?.splice(
                state.continent.descriptions?.findIndex((description) => description.id === action.payload.descriptionId),
                1,
                action.payload.descriptionDTO);
        },
        removeContinentDescription(state, action: PayloadAction<number>) {
            state.continent.descriptions = state.continent.descriptions?.filter((description) => description.id !== action.payload);
        },

        addImageToContinent(state, action: PayloadAction<ImageDTO>) {
            state.continent.images?.push(action.payload);
        },
        removeImageFromContinent(state, action: PayloadAction<number>) {
            state.continent.images = state.continent.images?.filter((image) => image.id !== action.payload);
        },

        setPlaneToContinent(state, action: PayloadAction<EntryDTO>) {
            state.continent.domObjects = action.payload;
        },
        removePlaneFromContinent(state) {
            state.continent.domObjects = undefined;
        },

        addNewKingdomToContinent(state, action: PayloadAction<EntryDTO>) {
            state.continent.subObjects?.push(action.payload);
        },
        removeKingdomFromContinent(state, action: PayloadAction<number>) {
            state.continent.subObjects = state.continent.subObjects?.filter((kingdom) => kingdom.id !== action.payload);
        },
    }
}
)

export const { setContinent, updateContinent,
    addContinentDescription, updateContinentDescription, removeContinentDescription,
    addImageToContinent, removeImageFromContinent,
    setPlaneToContinent, removePlaneFromContinent ,
    addNewKingdomToContinent, removeKingdomFromContinent  } = OneContinentSlice.actions;
export default OneContinentSlice.reducer;