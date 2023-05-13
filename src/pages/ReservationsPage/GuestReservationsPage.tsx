import { useEffect, useState } from 'react';
import { useApplicationStore } from '../../store/application.store';
import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Reservation } from '../../store/reservation-store/types/reservation.type';
import { format } from 'date-fns';
import { displayToast } from '../../utils/toast.caller';

export const GuestReservationsPage = () => {
  const getGuestsReservations = useApplicationStore(
    (state) => state.getGuestsReservations
  );
  const guestsReservationsRes = useApplicationStore(
    (state) => state.guestsReservationsRes
  );
  const deleteReservation = useApplicationStore(
    (state) => state.deleteReservation
  );
  const deleteReservationRes = useApplicationStore(
    (state) => state.deleteReservationRes
  );
  const cancelReservation = useApplicationStore(
    (state) => state.cancelReservation
  );
  const cancelReservationRes = useApplicationStore(
    (state) => state.cancelReservationRes
  );
  const toast = useToast();
  const [canDisplay, setCanDisplay] = useState(false);

  useEffect(() => {
    setCanDisplay(true);
    fetchReservations();
  }, [deleteReservationRes]);

  useEffect(() => {
    if (canDisplay) {
      if (cancelReservationRes.status === 'SUCCESS') {
        displayToast(toast, 'Reservation successfully canceled!', 'success');
        return;
      }
      if (cancelReservationRes.status === 'ERROR') {
        displayToast(toast, cancelReservationRes.error ?? '', 'error');
      }
      setCanDisplay(false);
    }
  }, [cancelReservationRes]);

  const fetchReservations = async () => {
    await getGuestsReservations();
  };

  const handleDeleteReservation = async (id: string) => {
    await deleteReservation(id);
  };
  const handleCancelReservation = async (id: string) => {
    await cancelReservation(id);
    await getGuestsReservations();
  };

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
                  <Td>
                    {item.accommodation.street}{' '}
                    {item.accommodation.streetNumber} {item.accommodation.city},{' '}
                    {item.accommodation.country}
                  </Td>
                  <Td>
                    {format(new Date(item.startDate), 'dd-MM-yyyy').toString()}
                  </Td>
                  <Td>
                    {format(new Date(item.endDate), 'dd-MM-yyyy').toString()}
                  </Td>
                  <Td>{item.guests}</Td>
                  <Td>
                    {item.status === 0 && <>PENDING</>}{' '}
                    {item.status === 1 && <>CONFIRMED</>}{' '}
                    {item.status === 2 && <>REJECTED</>}{' '}
                    {item.status === 3 && <>CANCELED</>}
                  </Td>
                  {item.status === 0 && (
                    <Td>
                      <Button
                        colorScheme='red'
                        onClick={() => handleDeleteReservation(item.id)}
                      >
                        Delete
                      </Button>
                    </Td>
                  )}
                  {item.status === 1 && (
                    <Td>
                      <Button
                        colorScheme='red'
                        onClick={() => handleCancelReservation(item.id)}
                      >
                        Cancel
                      </Button>
                    </Td>
                  )}
                  {item.status === 2 && <Td></Td>}
                  {item.status === 3 && <Td></Td>}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
