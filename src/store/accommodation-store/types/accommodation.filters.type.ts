
export type AccommodationFiltersAdditions = 
    "air_conditioner"|
    "free_parking"|
    "kitchen"|
    "featuredHostOnly"|
    "wifi"
export type AccommodationFilters = {
    additions: AccommodationFiltersAdditions[]
    price: {from: number, to: number}
}