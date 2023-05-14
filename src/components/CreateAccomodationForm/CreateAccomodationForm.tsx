import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useApplicationStore } from '../../store/application.store';
import { AccommodationPricing } from '../Accommodations/AccommodationPricing';
import { Pricing } from '../../store/accommodation-store/types/pricing.type';
import { CreateAccommodationPricingButton } from '../Accommodations/CreateAccommodationPricingButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Inputs = {
  name: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  country: string;
  wifi: boolean;
  kitchen: boolean;
  airConditioner: boolean;
  freeParking: boolean;
  autoReservation: boolean;
  minGuests: number;
  maxGuests: number;
  pictures?: FileList | null;
};

export const CreateAccomodationForm = ({ isOpen, onClose }: Props) => {
  const [pictures, setPictures] = useState<FileList | null>();
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const createAccommodation = useApplicationStore(
    (state) => state.createAccommodation
  );
  const createAccommodationRes = useApplicationStore(
    (state) => state.createAccommodationRes
  );
  const user = useApplicationStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (createAccommodationRes.status === 'SUCCESS') {
      onClose();
      return;
    }
  }, [createAccommodationRes]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { pictures: pics, ...existingDate } = data;
    await createAccommodation({
      ...existingDate,
      pictures: pictures ?? new FileList(),
      pricing,
    });
  };

  const updatePricing = (index: number, field: string, val: any) => {
    const newValues = [...pricing];
    newValues[index] = { ...newValues[index], [field]: val };
    setPricing(newValues);
  };

  const addPricing = () => {
    const newPricing: Pricing = {
      from: new Date(),
      to: new Date(),
      pricingType: 0,
      price: 0,
    };
    setPricing([...pricing, newPricing]);
  };

  useEffect(() => {
    if (createAccommodationRes.status === 'SUCCESS') {
      onClose();
    }
  }, [createAccommodationRes]);

  const deletePricing = (placing: number) => {
    const newValues = pricing.filter((price, index) => index !== placing);
    setPricing(newValues);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW={'1000px'}>
        <ModalHeader textAlign='center'>Create accomodation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={10}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                gap: '5px',
              }}
            >
              <Input
                type='text'
                placeholder='Name'
                {...register('name')}
              ></Input>
              <Input
                type='text'
                placeholder='Street'
                {...register('street')}
              ></Input>
              <Input
                type='text'
                placeholder='Street number'
                {...register('streetNumber')}
              ></Input>
              <Input
                type='text'
                placeholder='City'
                {...register('city')}
              ></Input>
              <Input
                type='text'
                placeholder='Zip code'
                {...register('zipCode')}
              ></Input>
              <Input
                type='text'
                placeholder='Country'
                {...register('country')}
              ></Input>
              <Wrap spacing={5} py={'3'} direction='row' margin='5px 0'>
                <WrapItem>
                  <Checkbox {...register('wifi')}>Wifi</Checkbox>
                </WrapItem>
                <WrapItem>
                  <Checkbox {...register('kitchen')}>Kitchen</Checkbox>
                </WrapItem>
                <WrapItem>
                  <Checkbox {...register('autoReservation')}>
                    Automatic Reservation
                  </Checkbox>
                </WrapItem>
                <WrapItem>
                  <Checkbox {...register('airConditioner')}>
                    Air conditioner
                  </Checkbox>
                </WrapItem>
                <WrapItem>
                  <Checkbox {...register('freeParking')}>Free parking</Checkbox>
                </WrapItem>
              </Wrap>
              <Input
                type='number'
                placeholder='Minimum guests'
                {...register('minGuests')}
              ></Input>
              <Input
                type='number'
                placeholder='Maximum guests'
                {...register('maxGuests')}
              ></Input>
              <Input
                type='file'
                multiple
                onChange={(e) => setPictures(e.target.files)}
              ></Input>
              <Flex justifyContent='center'>
                <Button type='submit' margin='15px 0'>
                  Create accommodation
                </Button>
              </Flex>
            </form>
            <Flex direction={'column'} flex={1}>
              <Flex
                direction={'column'}
                overflowY={'scroll'}
                paddingRight={1}
                maxH={'510px'}
                border={'1px solid lightgray'}
              >
                {pricing.map((price, index) => (
                  <AccommodationPricing
                    key={index}
                    from={price.from}
                    to={price.to}
                    pricingType={price.pricingType}
                    price={price.price}
                    onFromChange={(val) => updatePricing(index, 'from', val)}
                    onToChange={(val) => updatePricing(index, 'to', val)}
                    onPriceChange={(val) => updatePricing(index, 'price', val)}
                    onPricingTypeChange={(val) =>
                      updatePricing(index, 'pricingType', val)
                    }
                    onDelete={() => deletePricing(index)}
                  />
                ))}
              </Flex>
              <CreateAccommodationPricingButton onClick={() => addPricing()} />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
