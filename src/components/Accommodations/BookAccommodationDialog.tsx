import { useState } from "react";
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
} from "@chakra-ui/react";
import { Accommodation } from "../../store/accommodation-store/types/accommodation.type";
import { useApplicationStore } from "../../store/application.store";
import { useToast } from "@chakra-ui/react";
import { displayToast } from "../../utils/toast.caller";

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
  const [startDate, setStartDate] = useState(new Date("0001-01-01T00:00:00Z"));
  const [endDate, setEndDate] = useState(new Date("0001-01-01T00:00:00Z"));
  const [guests, setGuests] = useState(0);
  const [isDateValid, setIsDateValid] = useState(false);
  const [isGuestsValid, setIsGuestsValid] = useState(false);

  const handleStartDateChange = (event: any) => {
    const newStartDate = new Date(event.target.value);
    const today = new Date();
    if (
      newStartDate.getDate() > endDate.getDate() ||
      newStartDate.getDate() < today.getDate()
    ) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (event: any) => {
    const newEndDate = new Date(event.target.value);
    if (startDate.getDate() > newEndDate.getDate()) {
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

  const BookAccommodation = useApplicationStore(
    (state) => state.bookAccommodation
  );
  const user = useApplicationStore((state) => state.user);
  const toast = useToast();
  const book = async () => {
    await BookAccommodation({
      accommodationId: accommodation.id,
      startDate: startDate,
      endDate: endDate,
      guests: guests,
      buyerId: user?.id,
    });
    displayToast(toast, "Reservation request has been sent!", "success");
    closeModal();
  };

  const closeModal = () => {
    setActiveStep(0);
    setStartDate(new Date("0001-01-01T00:00:00Z"));
    setEndDate(new Date("0001-01-01T00:00:00Z"));
    setIsDateValid(false);
    setIsGuestsValid(false);
    onClose();
  };

  const steps = [
    { label: "Choose Dates", content: renderDateForm() },
    { label: "Choose Guests", content: renderGuestsForm() },
  ];

  function renderDateForm() {
    return (
      <>
        <ModalBody>
          <Flex flexDirection="row">
            <FormControl>
              <FormLabel mb="0">Start Date</FormLabel>
              <Input type="date" onChange={handleStartDateChange}></Input>
            </FormControl>
            <FormControl>
              <FormLabel mb="0">End Date</FormLabel>
              <Input type="date" onChange={handleEndDateChange}></Input>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
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
              <Flex flexDirection="row">
                <FormControl>
                  <FormLabel mb="0">
                    Number of guests (min: {accommodation.minGuests}, max:{" "}
                    {accommodation.maxGuests})
                  </FormLabel>
                  <Input
                    type="number"
                    width="150px"
                    min={accommodation.minGuests}
                    max={accommodation.maxGuests}
                    onChange={handleGuestsChange}
                  ></Input>
                </FormControl>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={cleanDates}>
                Previous
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={book}
                isDisabled={!isGuestsValid}
              >
                Book
              </Button>
            </ModalFooter>
          </>
        )}
        {isAvailableRes.data === false && (
          <>
            <ModalBody>
              Sorry, the accommodation is not available in the selected time
              range.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={cleanDates}>
                Previous
              </Button>
            </ModalFooter>
          </>
        )}
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book accommodation '{accommodation.name}'</ModalHeader>
        <ModalCloseButton />
        {steps[activeStep].content}
      </ModalContent>
    </Modal>
  );
};
