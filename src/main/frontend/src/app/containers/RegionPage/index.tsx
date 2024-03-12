import { useParams } from "react-router-dom";

export function RegionPage() {
    let { name } = useParams();
    return <div>
        <div className="d-grid gap-2">
            <h1>Region {name}</h1>
        </div>
    </div>
}