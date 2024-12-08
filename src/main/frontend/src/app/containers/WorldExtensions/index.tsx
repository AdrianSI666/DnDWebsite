import { useQuery } from "@tanstack/react-query";
import { Container } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import { WorldControllerService } from "../../../services/openapi";
import { WorldNaviagtionTab } from "../../components/navigation/WorldNavigationTab";

export function WorldHomePage() {
    let { name } = useParams();
    const { status, data: worldDTO, error } = useQuery({
        queryKey: ["world", name],
        queryFn: async () => WorldControllerService.getWorldByName(name!)
    })
    if (status === "pending") return <div>Loading...</div>;
    if (error) return <div>
        <h1>World named {name} doesn't exist.</h1>
    </div>;

    return <div className="d-grid gap-2" >
        <h1>World {worldDTO.world?.name}</h1>
        <WorldNaviagtionTab worldName={name!} />
        <Container key={worldDTO.world?.id}>
            <Outlet context={{world: worldDTO}}/>
        </Container>
    </div >
}