import { Accordion } from "react-bootstrap";
import { EntryFullDTO } from "../../../services/openapi";
import { DeleteConfirmationModal } from "../modals/deleteConfirmModal";
import { EditEntryModal } from "../modals/editEntryModal";

interface IAccordionHeaderLayout {
    deleteMainObjectButtonActionText: string;
    deleteEntry: ((id: number) => Promise<void>) | undefined;
    updateEntry: (id: number, name: string, shortDescription: string) => Promise<void>;
    categoryName: string;
    entryFullDTO: EntryFullDTO,
    children: string | React.ReactNode,
    fetchFullValue: (name: string) => Promise<void>
}

export function AccordionHeaderLayout(props: IAccordionHeaderLayout) {
    return <Accordion key={props.entryFullDTO.object?.id} defaultActiveKey={['0']}>
        <Accordion.Item eventKey={'' + props.entryFullDTO.object?.id!}
            className="borderFix">
            <Accordion.Header onClick={(e) => {
                if (e.currentTarget.className === "accordion-button collapsed") {
                    if (props.entryFullDTO.descriptions?.length === 0 &&
                        props.entryFullDTO.images?.length === 0 &&
                        props.entryFullDTO.subObjects?.length === 0) props.fetchFullValue(props.entryFullDTO.object?.name!)
                }
            }}>
                <table className="w-100">
                    <tbody>
                        <tr>
                            <td className="w-50"><h5><b>
                                <a href={props.categoryName + "s/" + props.entryFullDTO.object?.name} onClick={e => e.stopPropagation()}>
                                    {props.entryFullDTO.object?.name}
                                </a></b></h5></td>
                            <td rowSpan={3} className="w-10 ps-3 pt-auto pb-auto pe-2" style={{ width: "10%" }}>
                                <EditEntryModal updateFunction={props.updateEntry} categoryName={props.categoryName} id={props.entryFullDTO.object?.id!} name={props.entryFullDTO.object?.name!} shortDescription={props.entryFullDTO.object?.shortDescription!} />
                            </td>
                            <td rowSpan={3} className="w-10 ps-3 pt-auto pb-auto pe-3" style={{ width: "10%" }}>
                                <DeleteConfirmationModal deleteButtonActionText={props.deleteMainObjectButtonActionText} deleteObject={props.deleteEntry} title={props.entryFullDTO.object?.name!} id={props.entryFullDTO.object?.id!} />
                            </td>
                        </tr>
                        <tr>
                            <td className="w-50">Tags to implement</td>
                        </tr>
                        <tr>
                            <td className="w-50">{props.entryFullDTO.object?.shortDescription}</td>
                        </tr>
                    </tbody>
                </table>
            </Accordion.Header>
            <div>
                {props.children}
            </div>
        </Accordion.Item>
    </Accordion>
}