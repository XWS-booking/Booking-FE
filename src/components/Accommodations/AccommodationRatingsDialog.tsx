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
  Box,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { Accommodation } from '../../store/accommodation-store/types/accommodation.type';
import { useApplicationStore } from '../../store/application.store';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AccommodationRating } from '../../store/ratings-store/types/accommodationRating';
import {format} from 'date-fns'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation;
}

export const AccommodationRatingsDialog = ({
  isOpen,
  onClose,
  accommodation,
}: Props) => {

  const getAccommodationRatings = useApplicationStore(
    (state) => state.getAccommodationRatings
  );
  const accommodationRatingsRes = useApplicationStore(
    (state) => state.accommodationRatingsRes
  );

  useEffect(() => {
      fetchAccommodationRatings();
  }, [isOpen]);

  const fetchAccommodationRatings = async () => {
    await getAccommodationRatings(accommodation.id);
  };
 
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ratings</ModalHeader>
        <ModalCloseButton/>
        <Box padding={'5'} overflowY={'auto'} height={'400px'}>
        {accommodationRatingsRes.status == "LOADING" && <Spinner></Spinner>}
        {(accommodationRatingsRes.status == "SUCCESS" && accommodationRatingsRes.data) &&
          accommodationRatingsRes.data.map((item: AccommodationRating) => (
            <Flex key={item.id} justifyContent={'space-between'} mb={'5px'}>
              <Box>{item.guest.name} {item.guest.surname}</Box>
              <Box>{format(new Date(item.time), 'dd/MM/yyyy HH:mm').toString()}</Box>   
              <Badge colorScheme='orange'>{item.rating}</Badge>
            </Flex>
          ))}
          </Box>
        </ModalContent>
    </Modal>
  );
};
