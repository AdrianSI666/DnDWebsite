import { useQuery } from "@tanstack/react-query";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import JWTMenager from "../../../services/jwt/JWTMenager";
import { OpenAPI, WorldControllerService } from "../../../services/openapi";
import useUserState from "../../../services/storage/UserStorage";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";
import { DeleteConfirmationModal } from "../../components/modals/deleteConfirmModal";
import { EditEntryModal } from "../../components/modals/editEntryModal";
import { WorldFunction } from "./worldFunction";
import useJWTManager from "../../../services/jwt/JWTMenager"
import { HeaderLink } from "../Header/HeaderLink";

export function UserHomePage() {
    const navigate = useNavigate();
    //let { name } = useParams();
    //let isAuthor = false;
    const { userId } = useUserState(); //This can be used for verification of author to see if client can see edit buttons etc.
    if (JWTMenager.getToken() === null || JWTMenager.getToken() === undefined || JWTMenager.getToken() === "" || userId === null || userId === undefined) {
        navigate("/home");
    }

    const { saveWorld, editWorld, deleteWorld } = WorldFunction({ userId })
    
    const { status, data: worlds, error } = useQuery({
        queryKey: ["worldAuthorId", userId],
        queryFn: async () => {
            OpenAPI.TOKEN = useJWTManager.getToken();
            return WorldControllerService.getWorldsByAuthor(userId!)
        }
    })

    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>You're not a user that you say you are.</h1>
    </div>;

    return <div className="d-grid gap-2" >
        <h1>Worlds created by you</h1>
        <AddNewEntryModal addNewEntry={saveWorld} addButtonActionText={"Create new world"} />
        {worlds?.length === 0 && <div>No worlds created, yet.</div>}
        <Accordion>
            {worlds && worlds.map((world) =>
            (<Container key={world?.id}>
                <h1>World {world?.name}</h1>
                <Row className="accordion-header accordion-button oneEntryButton">
                    <Col>
                        <span>#Tags #to #implement</span>
                        <p>
                            {world?.shortDescription}
                        </p>
                        <EditEntryModal updateFunction={editWorld} categoryName={"World"} id={world?.id!} name={world?.name!} shortDescription={world?.shortDescription!} />
                        <DeleteConfirmationModal deleteButtonActionText={"Delete this world"} deleteObject={deleteWorld} title={world?.name!} id={world?.id!} />
                        <HeaderLink name={world.name!} link={"/worlds/home/" + world.name} />
                    </Col>
                </Row>
            </Container>)
            )}
        </Accordion>

    </div >
}