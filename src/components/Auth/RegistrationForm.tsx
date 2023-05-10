import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import {
  REGISTRATION_DEFAULT_VALUES,
  REGISTRATION_VALIDATION_SCHEMA,
} from '../../utils/auth.constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useApplicationStore } from '../../store/application.store';
import { useEffect } from 'react';
import { displayToast } from '../../utils/toast.caller';

export type FormValues = {
  email: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  country: string;
};

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const RegistrationForm = ({ isOpen, onOpen, onClose }: Props) => {
  const registerUser = useApplicationStore((state) => state.register);
  const registrationStateRes = useApplicationStore(
    (state) => state.registrationStateRes
  );
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: REGISTRATION_DEFAULT_VALUES,
    resolver: yupResolver(REGISTRATION_VALIDATION_SCHEMA),
  });

  const handleOnSubmit = async (values: FormValues) => {
    await registerUser(values);
  };

  useEffect(() => {
    console.log(registrationStateRes.status);
    if (registrationStateRes.status === 'SUCCESS') {
      displayToast(toast, 'Succesfully registered!', 'success');
      onClose();
      return;
    }
    if (registrationStateRes.status === 'ERROR') {
      displayToast(toast, registrationStateRes.error ?? '', 'error');
      return;
    }
  }, [registrationStateRes]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW={'800px'}>
        <ModalHeader textAlign={'center'}>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={5}>
            <Box flex={1}>
              <FormControl isInvalid={errors.email != null} h={'100px'}>
                <FormLabel>Email</FormLabel>
                <Input type='email' {...register('email')} />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.password != null} h={'100px'}>
                <FormLabel>Password</FormLabel>
                <Input type='password' {...register('password')} />
                {errors.password && (
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.name != null} h={'100px'}>
                <FormLabel>Name</FormLabel>
                <Input {...register('name')} />
                {errors.name && (
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.surname != null} h={'100px'}>
                <FormLabel>Surname</FormLabel>
                <Input {...register('surname')} />
                {errors.surname && (
                  <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.username != null} h={'100px'}>
                <FormLabel>Username</FormLabel>
                <Input {...register('username')} />
                {errors.username && (
                  <FormErrorMessage>
                    {errors.username?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box flex={1}>
              <FormControl isInvalid={errors.street != null} h={'100px'}>
                <FormLabel>Street</FormLabel>
                <Input {...register('street')} />
                {errors.street && (
                  <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.streetNumber != null} h={'100px'}>
                <FormLabel>Street Number</FormLabel>
                <Input {...register('streetNumber')} />
                {errors.streetNumber && (
                  <FormErrorMessage>
                    {errors.streetNumber?.message}
                  </FormErrorMessage>
                )}
              </FormControl>{' '}
              <FormControl isInvalid={errors.city != null} h={'100px'}>
                <FormLabel>City</FormLabel>
                <Input {...register('city')} />
                {errors.city && (
                  <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.zipCode != null} h={'100px'}>
                <FormLabel>Zip Code</FormLabel>
                <Input {...register('zipCode')} />
                {errors.zipCode && (
                  <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.country != null} h={'100px'}>
                <FormLabel>Country</FormLabel>
                <Input {...register('country')} />
                {errors.country && (
                  <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
          </Flex>
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
            Register
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
