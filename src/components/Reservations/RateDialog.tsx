import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
  Input,
  Flex,
  FormLabel,
} from '@chakra-ui/react';
import { useApplicationStore } from '../../store/application.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Reservation } from '../../store/reservation-store/types/reservation.type';

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
  const updateAccommodationRating = useApplicationStore((state) => state.updateAccommodationRating)
  const deleteAccommodationRating = useApplicationStore((state) => state.deleteAccommodationRating)
  const user = useApplicationStore((state) => state.user)
  useEffect(() => {
    setDefaultValues({rating: reservation?.accommodationRating?.rating.toString() ?? ""})
  }, [isOpen]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await rateAccommodation({accommodationId: reservation.accommodation.id, rating: parseInt(data.rating), guestId: user?.id, reservationId: reservation.id})
    onClose()
  };

  const onUpdateSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateAccommodationRating({id: reservation.accommodationRating?.id, rating: parseInt(data.rating), accommodationId: reservation.accommodation.id, oldRating: reservation.accommodationRating?.rating})
    onClose()
  };

  const onDeleteSubmit: SubmitHandler<Inputs> = async (data) => {
    await deleteAccommodationRating(reservation.accommodationRating?.id ?? "", reservation.id)
    reset({rating: ""})
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
            <FormLabel mt={'7px'}>Rating (min:1 max:5)</FormLabel>
            <Input width={'100px'} type={'number'}  {...register('rating', { required: true, min:1, max:5 })} defaultValue={defaultValues?.rating}></Input>
            { reservation?.accommodationRating?.id == "" ?
              <Button onClick={handleSubmit(onSubmit)}>Add Rating</Button> : <>
                <Button onClick={handleSubmit(onUpdateSubmit)}>Update</Button>
                <Button onClick={handleSubmit(onDeleteSubmit)}>Remove</Button>
              </>
            }
          </Flex>
        </ModalContent>
    </Modal>
  );
};
