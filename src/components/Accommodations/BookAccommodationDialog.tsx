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
  Spinner,
} from "@chakra-ui/react";
import { Accommodation } from "../../store/accommodation-store/types/accommodation.type";
import { useApplicationStore } from "../../store/application.store";
import { useToast } from "@chakra-ui/react";
import { displayToast } from "../../utils/toast.caller";

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
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (event: any) => {
    const newEndDate = new Date(event.target.value);
    if (startDate > newEndDate || startDate < new Date()) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
    }
    setEndDate(newEndDate);
  };

  const handleGuestsChange = (event: any) => {
    const newGuests = event.target.value
    if (newGuests >= accommodation.MinGuests && newGuests <=accommodation.MaxGuests) {
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

  const isAccommodationAvailable = useApplicationStore(state => state.isAccommodationAvailable)
  const isAvailableRes = useApplicationStore(state => state.isAvailableRes)
  const checkAvailability= async () => {
    await isAccommodationAvailable(accommodation.Id, startDate, endDate)
    handleNext()
  }

  const BookAccommodation = useApplicationStore(state => state.bookAccommodation)
  const user = useApplicationStore(state => state.user)
  const toast = useToast()
  const book = async () => {
    await BookAccommodation({accommodationId: accommodation.Id, startDate: startDate, endDate: endDate, guests: guests, buyerId: user?.id})
    displayToast(toast, "Reservation request has been sent!", "success");
    closeModal()
  }

  const closeModal = () => {
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
            <Button colorScheme="blue" mr={3} onClick={checkAvailability} isDisabled={!isDateValid}>
              Next
            </Button>
        </ModalFooter>
        </>
    );
  }

  function renderGuestsForm() {
    return (
        <>
        { isAvailableRes == true &&
            <><ModalBody>
            
                <Flex flexDirection='row'>
                    <FormControl>
                        <FormLabel mb='0'>Number of guests (min: {accommodation.MinGuests}, max: {accommodation.MaxGuests})</FormLabel>
                        <Input type='number' width="150px" min={accommodation.MinGuests} max={accommodation.MaxGuests} onChange={handleGuestsChange}></Input>
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
        }
         { isAvailableRes == false &&
            <><ModalBody>
              Sorry, the accommodation is not available in the selected time range.
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={cleanDates}>
                Previous
                </Button>
            </ModalFooter>
            </>
        }
        </>
    );
  }
  
  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book accommodation '{accommodation.Name}'</ModalHeader>
        <ModalCloseButton />
          {steps[activeStep].content}
      </ModalContent>
    </Modal>
  );
};
