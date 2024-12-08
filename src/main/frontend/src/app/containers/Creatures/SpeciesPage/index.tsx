import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { ApiError, SpeciesControllerService, SpeciesDTO } from "../../../../services/openapi";
import { AddNewEntryModal } from "../../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../../components/pagination/pagination";
import { SpeciesFunction } from "./speciesFunction";
import { SpeciesAccordion } from "./speciesAccordion";

export function SpeciesPage() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1)
    const { saveSpecies } = SpeciesFunction({ pageSize, pageNumber })

    const { status, data: speciesPage, error } = useQuery({
        queryKey: ["speciesPage", pageNumber, pageSize],
        queryFn: async () => SpeciesControllerService.getSpecies({ number: pageNumber, size: pageSize })
            .then(res => {
                return {
                    data: res.data?.map((speciesDto) => {
                        let speciesDTO: SpeciesDTO = {
                            species: speciesDto,
                            images: [],
                            regions: [],
                            subSpecies: [],
                            descriptions: []
                        }
                        return speciesDTO
                    }),
                    currentPage: res.currentPage,
                    totalPages: res.totalPages
                }
            }).catch((err: ApiError) => {
                console.log("My Error: ", err);
                throw err
            }),
        placeholderData: keepPreviousData,
    })

    const changeSpeciesPage = async (_event?: React.ChangeEvent<unknown>, value?: number, size?: number) => {
        if (size && size !== pageSize) {
            setPageSize(size);
        }
        if (value && value !== pageNumber) {
            setPageNumber(value!);
        }
    }

    if (status === "pending") return <div>Loading...</div>
    if (error) {
        console.log(error.message)
        return <div>Error trying to get data from server. Please try again later.</div>
    }
    return <div>
        <div className="d-grid gap-2">
            <h1>Speciess</h1>
            <AddNewEntryModal addNewEntry={saveSpecies} addButtonActionText={"Create new species"} />
            <CustomPagination pageSize={pageSize} changePage={changeSpeciesPage} page={speciesPage!} />
            {speciesPage.data?.length === 0 && <div>No species created, yet.</div>}
            <Accordion>
                {speciesPage?.data && speciesPage.data?.map((species) =>
                    (<SpeciesAccordion species={species} pageNumber={pageNumber} pageSize={pageSize} status={status} key={species.species?.id}/>)
                )}
            </Accordion>
        </div>
    </div>
}