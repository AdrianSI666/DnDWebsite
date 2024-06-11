import { DescriptionDTO } from "../../services/openapi"
import { SortedDescriptionDTO } from "./SortedDescriptionDTO";

interface IRowColumn {
    number: number,
    descriptions: Array<SortedDescriptionDTO>,
    sizeLeft: number
}

export interface IGridNotes {
    rows: IRowColumn[]
}

export function GriddingNotes() {
    const smallSize = 255;
    const mediumSize = 3000;
    const bigSize = 8000;
    const addNewRow = (grid: IGridNotes, i: number): void => {
        grid.rows.push({
            number: i,
            descriptions: new Array<DescriptionDTO>(),
            sizeLeft: 100
        });
        //return grid;
    }

    const addDescriptionToRow = (grid: IGridNotes, i: number, size: number, desc: DescriptionDTO): number => {
        if (grid.rows.at(i)!.sizeLeft - size < 0) {
            i = i + 1;
            addNewRow(grid, i);
            let SortedDescription: SortedDescriptionDTO = {
                id: desc.id,
                title: desc.title,
                text: desc.text,
                size: size
            }
            grid.rows.at(i)?.descriptions.push(SortedDescription)
            grid.rows.at(i)!.sizeLeft = grid.rows.at(i)!.sizeLeft - size
        }
        else {
            let SortedDescription: SortedDescriptionDTO = {
                id: desc.id,
                title: desc.title,
                text: desc.text,
                size: size
            }
            grid.rows.at(i)?.descriptions.push(SortedDescription)
            grid.rows.at(i)!.sizeLeft = grid.rows.at(i)!.sizeLeft - size
        }
        return i;
    }

    const grindNotes = async (descriptions: DescriptionDTO[]): Promise<IGridNotes> => {
        let grid: IGridNotes = {
            rows: new Array<IRowColumn>()
        }
        let i = 0
        addNewRow(grid, i);
        descriptions?.forEach(desc => {
            let textLength = desc.text?.length
            if (textLength! < smallSize) {
                i = addDescriptionToRow(grid, i, 25, desc)
            } else if (textLength! < mediumSize) {
                i = addDescriptionToRow(grid, i, 50, desc)
            } else if (textLength! < bigSize) {
                i = addDescriptionToRow(grid, i, 75, desc)
            } else {
                i = addDescriptionToRow(grid, i, 100, desc)
            }
        })
        return grid;
    }

    return { grindNotes };
}