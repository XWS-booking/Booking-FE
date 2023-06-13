import { Pagination } from "../../pagination.type";

export type AccommodationSearchFilters = {
    city: string,
    guests: number,
    startDate: Date,
    endDate: Date,
} & Pagination
