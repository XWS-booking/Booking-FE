import { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Badge,
  Text,
  Flex,
  Card,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { Accommodation } from '../../store/accommodation-store/types/accommodation.type';
import Slider from 'react-slick';
import { BookAccommodationDialog } from './BookAccommodationDialog';
import { useApplicationStore } from '../../store/application.store';
import { EditAccommodationForm } from '../EditAccommodationForm/EditAccommodationForm';

interface Props {
  accommodation: Accommodation;
  onEditSelected?: () => void;
}

export const AccommodationCard = ({ accommodation, onEditSelected }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const user = useApplicationStore((state) => state.user);
  const handleEdit = () => {
    if (onEditSelected) {
      onEditSelected();
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <Card
        width='50vw'
        display='flex'
        flexDirection='row'
        mb='3'
        position={'relative'}
      >
        <Button
          position={'absolute'}
          top={'5px'}
          right={'5px'}
          onClick={handleEdit}
        >
          Edit
        </Button>
        <Box padding='20px' width='40%'>
          <Slider {...settings}>
            {accommodation.pictureUrls?.map((image) => (
              <Box key={image}>
                <img
                  src={image}
                  alt=''
                  style={{
                    objectFit: 'cover',
                    height: '250px',
                    width: '250px',
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Box>
        <Box p='6' w='60%'>
          <Box display='flex' alignItems='baseline'>
            <Box
              color='gray.500'
              fontWeight='semibold'
              letterSpacing='wide'
              fontSize='xs'
              textTransform='uppercase'
              ml='2'
            >
              {accommodation.wifi === true && (
                <Badge borderRadius='full' px='2' colorScheme='teal'>
                  Wifi
                </Badge>
              )}
              {accommodation.kitchen === true && (
                <Badge borderRadius='full' px='2' colorScheme='teal'>
                  Kitchen
                </Badge>
              )}
              {accommodation.airConditioner === true && (
                <Badge borderRadius='full' px='2' colorScheme='teal'>
                  Air conditioner
                </Badge>
              )}
              {accommodation.freeParking === true && (
                <Badge borderRadius='full' px='2' colorScheme='teal'>
                  Free parking
                </Badge>
              )}
            </Box>
          </Box>

          <Box mt='1' fontWeight='semibold' lineHeight='tight'>
            {accommodation.name}
          </Box>
          <Box>
            <Text mt='1' color='gray.500'>
              {accommodation.street} {accommodation.streetNumber},{' '}
              {accommodation.zipCode} {accommodation.city},{' '}
              {accommodation.country}
            </Text>
            <Text mt='2'>
              Owner: {accommodation.owner.name} {accommodation.owner.surname},{' '}
              {accommodation.owner.email}
            </Text>
            <Text mt='2'>
              Min guests: {accommodation.minGuests} <br />
              Max guests: {accommodation.maxGuests}
            </Text>
          </Box>
          {user?.role == 0 && (
            <Box mt='2'>
              <Button colorScheme='blue' onClick={handleOpenModal}>
                Book
              </Button>
            </Box>
          )}
        </Box>
      </Card>
      <BookAccommodationDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        accommodation={accommodation}
      />
    </>
  );
};
