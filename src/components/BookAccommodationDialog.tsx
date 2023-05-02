import React, { useState } from "react";
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
import { Accommodation } from "../store/accommodation-store/types/accommodation.type";
import { useApplicationStore } from "../store/application.store";
import { useToast } from "@chakra-ui/react";

interface Props {
    isOpen : boolean
    onClose : () => void
    accommodation: Accommodation
 }


export const BookAccommodationDialog = ({ isOpen, onClose, accommodation } : Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep(prevStep => prevStep + 1);
  const handlePrev = () => setActiveStep(prevStep => prevStep - 1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guests, setGuests] = useState(0);
  const [isDateValid, setIsDateValid] = useState(false);
  const [isGuestsValid, setIsGuestsValid] = useState(false);

  const handleStartDateChange = (event: any) => {
    const newStartDate = new Date(event.target.value);
    if (newStartDate > endDate || newStartDate < new Date()) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
      setStartDate(newStartDate);
    }
  };

  const handleEndDateChange = (event: any) => {
    const newEndDate = new Date(event.target.value);
    if (startDate > newEndDate) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
      setEndDate(newEndDate);
    }
  };

  const handleGuestsChange = (event: any) => {
    const newGuests = event.target.value
    if (newGuests > 0) {
        setGuests(newGuests)
        setIsGuestsValid(true)
    } else{
        setIsGuestsValid(false)
    }
  };

  const cleanDates = () => {
    handlePrev()
    setIsDateValid(false)
  }

  const BookAccommodation = useApplicationStore(state => state.bookAccommodation)
  const toast = useToast()
  const book = async () => {
    await BookAccommodation({AccommodationId: accommodation.Id, StartDate: startDate, EndDate: endDate, Guests: guests, BuyerId: "6451456800523bd6eb9a9ee6"})
    toast({
        title: "Request sent",
        description: "Reservation request has been sent!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right"
    });
    setActiveStep(0)
    setIsDateValid(false);
    setIsGuestsValid(false);
    onClose()
  }

  const steps = [
    { label: "Choose Dates", content: renderDateForm() },
    { label: "Choose Guests", content: renderGuestsForm() },
  ];

  function renderDateForm() {
    return (
        <>
        <ModalBody>
            <Flex flexDirection='row'>
                <FormControl>
                    <FormLabel mb='0'>Start Date</FormLabel>
                    <Input type='date' onChange={handleStartDateChange}></Input>
                </FormControl>
                <FormControl>
                    <FormLabel mb='0'>End Date</FormLabel>
                    <Input type='date' onChange={handleEndDateChange}></Input>
                </FormControl>
            </Flex>
        </ModalBody>
        <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleNext} isDisabled={!isDateValid}>
              Next
            </Button>
        </ModalFooter>
        </>
    );
  }

  function renderGuestsForm() {
    return (
        <>
        <ModalBody>
            <Flex flexDirection='row'>
                <FormControl>
                    <FormLabel mb='0'>Guests</FormLabel>
                    <Input type='number' min='1' width='150px' onChange={handleGuestsChange}></Input>
                </FormControl>
            </Flex>
        </ModalBody>
        <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={cleanDates}>
              Previous
            </Button>
            <Button colorScheme="blue" mr={3} onClick={book} isDisabled={!isGuestsValid}>
              Book
            </Button>
        </ModalFooter>
        </>
    );
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book accommodation '{accommodation.Name}'</ModalHeader>
        <ModalCloseButton />
          {steps[activeStep].content}
      </ModalContent>
    </Modal>
  );
};