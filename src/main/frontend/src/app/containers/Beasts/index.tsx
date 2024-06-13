import { Dispatch, createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ApiError, CultureControllerService, EntryDTO, EntryFullDTO, PageInfo } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";
import { AddNewEntryModal } from "../../components/modals/addNewEntryModal";
import { CustomPagination } from "../../components/pagination/pagination";
import { useAppDispatch, useAppSelector } from "../../hooks";


export function BeastPage() {


    return <div>
        <div className="d-grid gap-2">
            <h1>Beasts</h1>

        </div>
    </div>
}