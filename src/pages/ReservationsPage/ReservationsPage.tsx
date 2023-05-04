import { useEffect, useState } from "react"
import { useApplicationStore } from "../../store/application.store"
import { Button, Flex, Spinner, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Reservation } from "../../store/reservation-store/types/reservation.type";
import { format } from 'date-fns'

export const ReservationsPage = () => {

    const getGuestsReservations = useApplicationStore(state => state.getGuestsReservations)
    const guestsReservationsRes = useApplicationStore(state => state.guestsReservationsRes)
    const deleteReservation = useApplicationStore(state => state.deleteReservation)
    const deleteReservationRes = useApplicationStore(state => state.deleteReservationRes)
 
    useEffect(() => {
        fetchReservations()
    }, [deleteReservationRes])

    const fetchReservations = async () =>{
        await getGuestsReservations()
    }

    const handleDeleteReservation = async (id: string) => {
        await deleteReservation(id)
    }

    return (
        <>
          <TableContainer flex={1}>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption>Reservations</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Accommodation name</Th>
                            <Th>Address</Th>
                            <Th>Start date</Th>
                            <Th>End date</Th>
                            <Th>Guests</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {guestsReservationsRes.data &&
                            guestsReservationsRes.data.map((item: Reservation) => (
                                <Tr key={item.id}>
                                    <Td>{item.accommodation.name}</Td>
                                    <Td>{item.accommodation.street} {item.accommodation.streetNumber} {item.accommodation.city}, {item.accommodation.country}</Td>
                                    <Td>{format(new Date(item.startDate), 'dd-MM-yyyy').toString()}</Td>
                                    <Td>{format(new Date(item.endDate), 'dd-MM-yyyy').toString()}</Td>
                                    <Td>{item.guests}</Td>
                                    <Td>{item.status === 0 && <>PENDING</>} {item.status === 1 && <>APPROVED</>} {item.status === 2 && <>REJECTED</>} {item.status === 3 && <>CANCELED</>}</Td>
                                    {
                                        item.status === 0 &&
                                        <Td>
                                            <Button colorScheme="red" onClick={() => handleDeleteReservation(item.id)}>
                                                Delete
                                            </Button>
                                        </Td>
                                    }
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )

}
