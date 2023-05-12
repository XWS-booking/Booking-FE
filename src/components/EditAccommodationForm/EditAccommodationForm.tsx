import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { AccommodationPricing } from '../Accommodations/AccommodationPricing';
import { CreateAccommodationPricingButton } from '../Accommodations/CreateAccommodationPricingButton';
import React, { useEffect, useState } from 'react';
import { Pricing } from '../../store/accommodation-store/types/pricing.type';
import { useApplicationStore } from '../../store/application.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Accommodation } from '../../store/accommodation-store/types/accommodation.type';
import { displayToast } from '../../utils/toast.caller';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export const EditAccommodationForm = ({ isOpen, onClose, id }: Props) => {
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const toast = useToast();
  const findAccommodationById = useApplicationStore(
    (state) => state.getAccommodation
  );
  const [accommodation, setAccommodation] = useState<Accommodation | null>(
    null
  );
  const editPricing = useApplicationStore((state) => state.editPricing);
  const editPricingRes = useApplicationStore((state) => state.editPricingRes);

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

  const deletePricing = (placing: number) => {
    const newValues = pricing.filter((price, index) => index !== placing);
    setPricing(newValues);
  };

  const loadAccommodation = async () => {
    const accommodation = await findAccommodationById(id ?? '');
    setAccommodation(accommodation);
    setPricing(accommodation.pricing ?? []);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await editPricing(id, pricing);
  };

  useEffect(() => {
    if (id === '') return;
    loadAccommodation();
  }, [id]);

  useEffect(() => {
    if (editPricingRes.status === 'SUCCESS') {
      displayToast(toast, 'Successfully updated pricing', 'success');
      loadAccommodation();
      onClose();
      return;
    }
    if (editPricingRes.status === 'ERROR') {
      displayToast(toast, editPricingRes.error ?? '', 'error');
    }
  }, [editPricingRes.status]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW={'1000px'}>
        <ModalHeader textAlign='center'>Create accomodation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={10}>
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                gap: '5px',
              }}
            >
              <Input
                type='text'
                disabled={true}
                value={accommodation?.name}
                placeholder='Name'
              ></Input>
              <Input
                type='text'
                disabled={true}
                value={accommodation?.street}
                placeholder='Street'
              ></Input>
              <Input
                type='text'
                disabled={true}
                value={accommodation?.streetNumber}
                placeholder='Street number'
              ></Input>
              <Input
                type='text'
                disabled={true}
                value={accommodation?.city}
                placeholder='City'
              ></Input>
              <Input
                type='text'
                disabled={true}
                value={accommodation?.zipCode}
                placeholder='Zip code'
              ></Input>
              <Input
                type='text'
                disabled={true}
                value={accommodation?.country}
                placeholder='Country'
              ></Input>
              <Wrap spacing={5} py={'3'} direction='row' margin='5px 0'>
                <WrapItem>
                  <Checkbox disabled={true} isChecked={accommodation?.wifi}>
                    Wifi
                  </Checkbox>
                </WrapItem>
                <WrapItem>
                  <Checkbox disabled={true} isChecked={accommodation?.kitchen}>
                    Kitchen
                  </Checkbox>
                </WrapItem>

                <WrapItem>
                  <Checkbox
                    disabled={true}
                    isChecked={accommodation?.airConditioner}
                  >
                    Air conditioner
                  </Checkbox>
                </WrapItem>
                <WrapItem>
                  <Checkbox
                    disabled={true}
                    isChecked={accommodation?.freeParking}
                  >
                    Free parking
                  </Checkbox>
                </WrapItem>
              </Wrap>
              <Input
                type='number'
                value={accommodation?.minGuests}
                disabled={true}
                placeholder='Minimum guests'
              ></Input>
              <Input
                type='number'
                value={accommodation?.maxGuests}
                disabled={true}
                placeholder='Maximum guests'
              ></Input>
              <Flex justifyContent='center'>
                <Button type='submit' margin='15px 0'>
                  Edit accommodation
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
