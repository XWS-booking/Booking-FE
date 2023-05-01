import { useEffect } from "react"
import { useApplicationStore } from "../../store/application.store"

export const AccommodationPage = () => {

    const getAccommodations = useApplicationStore(state => state.getAccommodations)
    const accommodations = useApplicationStore(state => state.accommodations)

    useEffect(() => {
        getAccommodations("", -1, new Date("0001-01-01T00:00:00Z"), new Date("0001-01-01T00:00:00Z"))
    }, [])

    return (
        <>
        </>
    )
}

