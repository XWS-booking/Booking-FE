import {
  Button,
  Divider,
  Flex,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Reservation } from '../store/reservation-store/types/reservation.type';
import moment from 'moment';
import { useApplicationStore } from '../store/application.store';
import { Flight } from '../store/accommodation-store/types/flight.type';
import { BuyFlightTicketModal } from '../components/Flights/BuyFlightTicketModal';

export const ReservationFlightTicketsPage = () => {
  const location = useLocation();
  const reservation: Reservation = location.state?.data;
  const getDepartureFlights = useApplicationStore(
    (state) => state.getDepartureFlights
  );
  const getDestinationFlights = useApplicationStore(
    (state) => state.getDestinationFlights
  );
  const departureFlights = useApplicationStore(
    (state) => state.getDepartureFlightsRes
  );
  const destinationFlights = useApplicationStore(
    (state) => state.getDestinationFlightsRes
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDepartureFlights = async (city: string) => {
    await getDepartureFlights(
      city,
      reservation.accommodation.city,
      reservation.startDate
    );
  };
  const handleDestinationFlights = async (city: string) => {
    await getDestinationFlights(
      reservation.accommodation.city,
      city,
      reservation.startDate
    );
  };

  return (
    <Flex width={'100%'} direction={'column'}>
      <Flex justifyContent={'center'} width={'100%'} padding={'15px 0'}>
        <Text textAlign={'center'} fontSize={'23px'}>
          {reservation.accommodation.city} - accommodation:{' '}
          {reservation.accommodation.name}
          {', '}
          {moment(reservation.startDate).format('DD/MM/YYYY')}
          {' - '}
          {moment(reservation.endDate).format('DD/MM/YYYY')}
        </Text>
      </Flex>
      <Flex width={'100%'}>
        <Flex direction={'column'} width={'50%'} alignItems={'center'}>
          <Text>Destination flight</Text>
          <Flex alignItems={'center'}>
            <Input
              onChange={(e) => handleDepartureFlights(e.target.value)}
              placeholder='Departure'
              width={'250px'}
            ></Input>
            <Text>{' - '}</Text>
            <Text>{reservation.accommodation.city}</Text>
          </Flex>
          <Flex direction={'column'} padding={'25px'}>
            {departureFlights.data?.map((flight: Flight) => (
              <Flex
                key={flight.id}
                padding={'15px'}
                boxShadow={'rgba(149, 157, 165, 0.2) 0px 8px 24px;'}
                alignItems={'center'}
                gap={'15px'}
              >
                <Text>
                  {' '}
                  {flight.departure} - {flight.destination}{' '}
                  {moment(flight.date).format('DD/MM/YYYY-hh:mm')}
                </Text>
                <Button onClick={onOpen}>Buy ticket</Button>
                <BuyFlightTicketModal
                  isOpen={isOpen}
                  onClose={onClose}
                  flight={flight}
                />
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Divider orientation='vertical' height={'100vh'}></Divider>
        <Flex direction={'column'} width={'50%'} alignItems={'center'}>
          <Text>Return flight</Text>
          <Flex alignItems={'center'}>
            <Text>{reservation.accommodation.city}</Text>
            <Text>{' - '}</Text>
            <Input
              onChange={(e) => handleDestinationFlights(e.target.value)}
              placeholder='Destination'
              width={'250px'}
            ></Input>
          </Flex>
          <Flex direction={'column'} padding={'25px'}>
            {destinationFlights.data?.map((flight: Flight) => (
              <Flex
                key={flight.id}
                padding={'15px'}
                boxShadow={'rgba(149, 157, 165, 0.2) 0px 8px 24px;'}
                alignItems={'center'}
                gap={'15px'}
              >
                <Text>
                  {' '}
                  {flight.departure} - {flight.destination}{' '}
                  {moment(flight.date).format('DD/MM/YYYY-hh:mm')}
                </Text>
                <Button onClick={onOpen}>Buy ticket</Button>
                <BuyFlightTicketModal
                  isOpen={isOpen}
                  onClose={onClose}
                  flight={flight}
                />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
