import {Pagination} from "../../pagination.type";

export type AccomodationsFilter = {
    city: string,
    guests: number,
    startDate: string,
    endDate: string,
} & Pagination
