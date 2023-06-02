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
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { HOST_RATE_VALIDATION_SCHEMA } from '../../utils/auth.constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { HostRate } from '../../store/ratings-store/types/hostRate';
import { useApplicationStore } from '../../store/application.store';

export type FormValues = {
  rate: string;
};

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  hostRate?: HostRate;
  flag: 'UPDATE' | 'NEW';
  host: string;
}

export const RateForm = ({
  isOpen,
  onOpen,
  onClose,
  hostRate,
  host,
  flag,
}: Props) => {
  const updateHostRating = useApplicationStore(
    (state) => state.updateHostRating
  );
  const createHostRating = useApplicationStore(
    (state) => state.createHostRating
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(HOST_RATE_VALIDATION_SCHEMA),
  });

  const handleOnSubmit = async (values: FormValues) => {
    if (flag === 'UPDATE') {
      await updateHostRating(hostRate?.Id ?? '', values.rate);
      return;
    }
    await createHostRating(host, values.rate);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>Rate host</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mx={4} mb={6}>
            <FormControl isInvalid={errors.rate != null} h={'100px'} mb={'2'}>
              <FormLabel>Rate</FormLabel>
              <Input
                type='number'
                {...register('rate')}
                defaultValue={hostRate?.Rating}
              />
              {errors.rate && (
                <FormErrorMessage>{errors.rate.message}</FormErrorMessage>
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
              Rate
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
