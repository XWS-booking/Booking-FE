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
import { SubmitHandler, useForm } from 'react-hook-form';
import { Reservation } from '../../store/reservation-store/types/reservation.type';
import { render } from '@testing-library/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
}

type Inputs = {
  rating: string;
};

export const RateDialog = ({
  isOpen,
  onClose,
  reservation,
}: Props) => {

  const [defaultValues, setDefaultValues] = useState<Inputs>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>();

  const rateAccommodation = useApplicationStore(
    (state) => state.rateAccommodation
  );
  const user = useApplicationStore((state) => state.user)
  useEffect(() => {
    setDefaultValues({rating: reservation?.accommodationRating?.rating.toString() ?? ""})
  }, [isOpen]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await rateAccommodation({accommodationId: reservation.accommodation.id, rating: parseInt(data.rating), guestId: user?.id, reservationId: reservation.id})
    onClose()
  };

  const close = () => {
    reset(defaultValues)
    onClose()
  };

  return (
    <Modal isOpen={isOpen} onClose={close} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rate accommodation</ModalHeader>
        <ModalCloseButton/>
          <Flex flexDirection={'row'} padding={'5'} justifyContent={'space-between'}>
            <FormLabel>Rating</FormLabel>
            <Input type={'number'} min={'1'} max={'5'} {...register('rating', { required: true })} defaultValue={defaultValues?.rating}></Input>
            { reservation?.accommodationRating?.id == "" ?
              <Button onClick={handleSubmit(onSubmit)}>Rate</Button> : <>
                <Button>Update</Button>
                <Button>Remove</Button>
              </>
            }
          </Flex>
        </ModalContent>
    </Modal>
  );
};
