import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Flex,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { Accommodation } from '../../store/accommodation-store/types/accommodation.type';
import { useApplicationStore } from '../../store/application.store';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation;
}

export const BookAccommodationDialog = ({
  isOpen,
  onClose,
  accommodation,
}: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handlePrev = () => setActiveStep((prevStep) => prevStep - 1);
  const [startDate, setStartDate] = useState(new Date('0001-01-01T00:00:00Z'));
  const [endDate, setEndDate] = useState(new Date('0001-01-01T00:00:00Z'));
  const [guests, setGuests] = useState(0);
  const [isDateValid, setIsDateValid] = useState(false);
  const [isGuestsValid, setIsGuestsValid] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);

  const getAccommodationsReservations = useApplicationStore(
    (state) => state.getAccommodationsReservations
  );
  const accommodationsReservationsRes = useApplicationStore(
    (state) => state.accommodationsReservationsRes
  );
  const getBookingPrice = useApplicationStore((state) => state.getBookingPrice);

  useEffect(() => {
      fetchAccommodationsReservations();
  }, []);

  const fetchAccommodationsReservations = async () => {
    await getAccommodationsReservations(accommodation.id);
  };

  const filterDate = (date: Date) => {
    if (accommodationsReservationsRes.status == 'IDLE') filterDate(date);
    for (const range of accommodationsReservationsRes.data) {
      if (
        date >= adjustTimezoneNegative(new Date(range.startDate)) &&
        date <= adjustTimezoneNegative(new Date(range.endDate)) &&
        range.status == 1
      ) {
        return false;
      }
    }
    return accommodation.pricing.some((price) => {
      return (
        date >= adjustTimezoneNegative(new Date(price.from)) &&
        date <= adjustTimezoneNegative(new Date(price.to))
      );
    });
  };

  const handleStartDateChange = (newStartDate: Date) => {
    if (newStartDate > endDate) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (newEndDate: Date) => {
    if (startDate > newEndDate) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
    }
    setEndDate(newEndDate);
  };

  const handleGuestsChange = (event: any) => {
    const newGuests = event.target.value;
    if (
      newGuests >= accommodation.minGuests &&
      newGuests <= accommodation.maxGuests
    ) {
      setGuests(newGuests);
      setIsGuestsValid(true);
    } else {
      setIsGuestsValid(false);
    }
  };

  const cleanDates = () => {
    handlePrev();
    setIsDateValid(false);
  };

  const isAccommodationAvailable = useApplicationStore(
    (state) => state.isAccommodationAvailable
  );
  const isAvailableRes = useApplicationStore((state) => state.isAvailableRes);
  const checkAvailability = async () => {
    await isAccommodationAvailable({
      id: accommodation.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    handleNext();
  };

  const checkBookingPrice = async () => {
    const body = {
      from: adjustTimezone(startDate),
      to: adjustTimezone(endDate),
      guests: +guests,
    };
    const price = await getBookingPrice(accommodation.id, body);
    setCurrentPrice(price);
    handleNext();
  };

  const BookAccommodation = useApplicationStore(
    (state) => state.bookAccommodation
  );
  const user = useApplicationStore((state) => state.user);
  const book = async () => {
    await BookAccommodation({
      accommodationId: accommodation.id,
      startDate: startDate,
      endDate: endDate,
      guests: guests,
      buyerId: user?.id,
    });
    closeModal();
  };

  const closeModal = () => {
    setActiveStep(0);
    setStartDate(new Date('0001-01-01T00:00:00Z'));
    setEndDate(new Date('0001-01-01T00:00:00Z'));
    setIsDateValid(false);
    setIsGuestsValid(false);
    onClose();
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  const adjustTimezone = (date: Date) => {
    const localOffset = -date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + localOffset);
    return date;
  };
  const adjustTimezoneNegative = (date: Date) => {
    const localOffset = -date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - localOffset);
    return date;
  };

  const steps = [
    { label: 'Choose Dates', content: renderDateForm() },
    { label: 'Choose Guests', content: renderGuestsForm() },
    { label: 'Price', content: renderPrice() },
  ];

  function renderPrice() {
    return (
      <>
        <ModalBody>
          <Text>{`Date Range: : ${formatDate(startDate)} - ${formatDate(
            endDate
          )}`}</Text>
          <Text>{`Guests: ${guests}`}</Text>
          <Text>{`Price: ${currentPrice}€ `}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='gray' mr={3} onClick={cleanDates}>
            Previous
          </Button>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={book}
            isDisabled={!isGuestsValid}
          >
            Book
          </Button>
        </ModalFooter>
      </>
    );
  }

  function renderDateForm() {
    return (
      <>
        <ModalBody>
          <Flex flexDirection='row'>
            <FormControl>
              <FormLabel mb='0'>Start Date</FormLabel>
              <DatePicker
                inline
                filterDate={filterDate}
                onChange={handleStartDateChange}
                minDate={new Date()}
              />
            </FormControl>
            <FormControl>
              <FormLabel mb='0'>End Date</FormLabel>
              <DatePicker
                inline
                filterDate={filterDate}
                onChange={handleEndDateChange}
                minDate={new Date()}
              />
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={checkAvailability}
            isDisabled={!isDateValid}
          >
            Next
          </Button>
        </ModalFooter>
      </>
    );
  }

  function renderGuestsForm() {
    return (
      <>
        {isAvailableRes.data === true && (
          <>
            <ModalBody>
              <Flex flexDirection='row'>
                <FormControl>
                  <FormLabel mb='0'>
                    Number of guests (min: {accommodation.minGuests}, max:{' '}
                    {accommodation.maxGuests})
                  </FormLabel>
                  <Input
                    type='number'
                    width='150px'
                    min={accommodation.minGuests}
                    max={accommodation.maxGuests}
                    onChange={handleGuestsChange}
                  ></Input>
                </FormControl>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='gray' mr={3} onClick={cleanDates}>
                Previous
              </Button>
              <Button
                colorScheme='blue'
                mr={3}
                onClick={checkBookingPrice}
                isDisabled={!isGuestsValid}
              >
                Next
              </Button>
            </ModalFooter>
          </>
        )}
        {!isAvailableRes.data && (
          <>
            <ModalBody>
              Sorry, the accommodation is not available in the selected time
              range.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='gray' mr={3} onClick={cleanDates}>
                Previous
              </Button>
            </ModalFooter>
          </>
        )}
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book accommodation '{accommodation.name}'</ModalHeader>
        <ModalCloseButton />
        {steps[activeStep].content}
      </ModalContent>
    </Modal>
  );
};
