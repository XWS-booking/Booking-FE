import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Flight } from '../../store/accommodation-store/types/flight.type';
import moment from 'moment';
import { useApplicationStore } from '../../store/application.store';

export type FormValues = {
  apiKey: string;
  ticketsNum: string;
};

interface Props {
  isOpen: boolean;
  flight: Flight;
  onClose: () => void;
}

export const BuyFlightTicketModal = ({ isOpen, flight, onClose }: Props) => {
  const buyTickets = useApplicationStore((state) => state.purchaseFlightTicket);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({});

  const handleOnSubmit = async (values: FormValues) => {
    await buyTickets(flight.id, parseInt(values.ticketsNum), values.apiKey);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>
          Enter your flight api key
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mx={4} mb={6}>
            <Text textAlign={'center'}>
              {flight.departure} - {flight.destination}{' '}
              {moment(flight.date).format('DD/MM/YYYY-hh:mm')}
            </Text>
            <FormControl
              isInvalid={errors.ticketsNum != null}
              h={'100px'}
              mb={'2'}
            >
              <FormLabel>Tickets quantity</FormLabel>
              <Input
                type='number'
                max={flight.freeSeats}
                min={0}
                {...register('ticketsNum')}
              />
              {errors.ticketsNum && (
                <FormErrorMessage>{errors.ticketsNum.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.apiKey != null} h={'100px'} mb={'2'}>
              <FormLabel>Api key</FormLabel>
              <Input type='email' {...register('apiKey')} />
              {errors.apiKey && (
                <FormErrorMessage>{errors.apiKey.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              onClick={handleSubmit(handleOnSubmit)}
              mt={'4'}
              fontWeight={'bold'}
              bg={'#003b95'}
              _hover={{
                bg: '#136ed1',
              }}
              w='100%'
              mx={'auto'}
              color={'white'}
            >
              Buy ticket
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
