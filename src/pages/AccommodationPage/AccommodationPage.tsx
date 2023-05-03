import { useEffect, useState } from "react"
import { useApplicationStore } from "../../store/application.store"
import { Box, Image, Badge, Text, Flex, Spinner } from "@chakra-ui/react";
import { Accommodation } from "../../store/accommodation-store/types/accommodation.type";
import { AccommodationCard } from "../../components/Accommodations/AccommodationCard";
import "../../styles/pagination.css"
import ReactPaginate from 'react-paginate';
import { SearchAccommodation } from "../../components/Accommodations/SearchAccommodation";
import { start } from "repl";

export const AccommodationPage = () => {

    const getAccommodations = useApplicationStore(state => state.getAccommodations)
    const accommodationPage = useApplicationStore(state => state.accommodationPage)
    const spinner = useApplicationStore(state => state.spinner)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [city, setCity] = useState<string>("")
    const [guests, setGuests] = useState<number>(-1)
    const [startDate, setStartDate] = useState<Date>(new Date("0001-01-01T00:00:00Z"))
    const [endDate, setEndDate] = useState<Date>(new Date("0001-01-01T00:00:00Z"))

    useEffect(() => {
        getAccommodations(city, guests, startDate, endDate, 4, currentPage)
    }, [])

    const sendData = (city: string, guests: number, startDate: Date, endDate: Date) => {
        setCity(city)
        setGuests(guests)
        setStartDate(startDate)
        setEndDate(endDate)
        setCurrentPage(1)
    };
    
    const handlePageClick = async (event: any) => {
        await getAccommodations(city, guests, startDate, endDate, 4, event.selected + 1)
        setCurrentPage(event.selected + 1)
    };

    return (
        <>
            <SearchAccommodation sendData={sendData}></SearchAccommodation>
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
            {accommodationPage.data &&
                accommodationPage.data.map((item: Accommodation) => (
                    <AccommodationCard key={item.id} accommodation={item}></AccommodationCard>
                ))
            
            }
            
            {spinner == true &&
                <Flex justifyContent='center'>
                    <Spinner size='xl' />
                </Flex>
            }
            </Flex>
            <Flex flexDirection='column' justifyContent='column' padding='15px 20px' boxSizing='border-box' width='100%' height='100%' mt={'auto'}>
                <ReactPaginate
                    activeClassName={'item active '}
                    forcePage={currentPage - 1}
                    breakClassName={'item break-me '}
                    breakLabel={'...'}
                    containerClassName={'pagination'}
                    disabledClassName={'disabled-page'}
                    marginPagesDisplayed={2}
                    nextClassName={"item next "}
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageCount={Math.ceil(accommodationPage.totalCount/4)}
                    pageClassName={'item pagination-page '}
                    pageRangeDisplayed={2}
                    previousClassName={"item previous"}
                    previousLabel="<" />
            </Flex>
        </>
    )
}

