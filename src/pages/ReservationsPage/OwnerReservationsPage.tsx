import { useEffect } from "react";
import { useApplicationStore } from "../../store/application.store";
import {
  Button,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { Reservation } from "../../store/reservation-store/types/reservation.type";
import { format } from "date-fns";

export const OwnerReservationsPage = () => {
  const getOwnersReservations = useApplicationStore(
    (state) => state.getOwnersReservations
  );
  const ownersReservationsRes = useApplicationStore(
    (state) => state.ownersReservationsRes
  );
  const confirmReservation = useApplicationStore(
    (state) => state.confirmReservation
  );
  const confirmReservationRes = useApplicationStore(
    (state) => state.confirmReservationRes
  );
  const rejectReservation = useApplicationStore(
    (state) => state.rejectReservation
  );
  const rejectReservationRes = useApplicationStore(
    (state) => state.rejectReservationRes
  );
  const fetchReservations = async () => {
    await getOwnersReservations();
  };
  useEffect(() => {
    fetchReservations();
  }, [rejectReservationRes, confirmReservationRes]);

  const handleConfirmReservation = async (id: string) => {
    console.log("confirm!");
    await confirmReservation(id);
  };

  const handleRejectReservation = async (id: string) => {
    console.log("reject!");
    await rejectReservation(id);
  };

  return (
    <>
      <TableContainer flex={1}>
        <Table variant="striped" colorScheme="teal">
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
            {ownersReservationsRes.data &&
              ownersReservationsRes.data.map((item: Reservation) => (
                <Tr key={item.id}>
                  <Td>{item.accommodation.name}</Td>
                  <Td>
                    {item.accommodation.street}{" "}
                    {item.accommodation.streetNumber} {item.accommodation.city},{" "}
                    {item.accommodation.country}
                  </Td>
                  <Td>
                    {format(new Date(item.startDate), "dd-MM-yyyy").toString()}
                  </Td>
                  <Td>
                    {format(new Date(item.endDate), "dd-MM-yyyy").toString()}
                  </Td>
                  <Td>{item.guests}</Td>
                  <Td>
                    {item.status === 0 && (
                      <Text justifyContent={"center"}>PENDING</Text>
                    )}{" "}
                    {item.status === 1 && (
                      <Text justifyContent={"center"}>CONFIRMED</Text>
                    )}{" "}
                    {item.status === 2 && (
                      <Text justifyContent={"center"}>REJECTED</Text>
                    )}{" "}
                    {item.status === 3 && (
                      <Text justifyContent={"center"}>CANCELED</Text>
                    )}
                  </Td>
                  {item.status === 0 ? (
                    <Td>
                      <Flex gap={"4"}>
                        <Button
                          colorScheme="green"
                          width={"50%"}
                          onClick={() => handleConfirmReservation(item.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          colorScheme="red"
                          width={"50%"}
                          onClick={() => handleRejectReservation(item.id)}
                        >
                          Reject
                        </Button>
                      </Flex>
                    </Td>
                  ) : (
                    <Td></Td>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
