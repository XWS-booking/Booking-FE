import { useEffect, useState } from "react"
import { Box, Image, Badge, Text, Flex, Card, Button } from "@chakra-ui/react";
import { Accommodation } from "../../store/accommodation-store/types/accommodation.type";
import Slider from 'react-slick';
import { title } from "process";
import { BookAccommodationDialog } from "./BookAccommodationDialog";
import { useApplicationStore } from "../../store/application.store";

interface Props {
    accommodation: Accommodation
 }

export const AccommodationCard = ({accommodation} : Props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const user = useApplicationStore(state => state.user)

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
      };

    return (
        <>
    <Card maxWidth="45vw" display="flex" flexDirection='row' mb='3'>
      <Box padding='20px' width="40%">
        <Slider {...settings}>
          {accommodation.PictureUrls.map((image) => (
            <Box key={image}>
              <img src={image} alt="" style={{ objectFit: "cover", height: "250px", width :"250px"}} />
            </Box>
          ))}
        </Slider>
      </Box>
      <Box p="6" w="60%">
          <Box display="flex" alignItems="baseline">
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {accommodation.Wifi === true && <Badge borderRadius="full" px="2" colorScheme="teal">Wifi</Badge>}
              {accommodation.Kitchen === true && <Badge borderRadius="full" px="2" colorScheme="teal">Kitchen</Badge>}
              {accommodation.AirConditioner === true && <Badge borderRadius="full" px="2" colorScheme="teal">Air conditioner</Badge>}
              {accommodation.FreeParking === true && <Badge borderRadius="full" px="2" colorScheme="teal">Free parking</Badge>}
            </Box>
          </Box>

          <Box mt="1" fontWeight="semibold" lineHeight="tight">
            {accommodation.Name}
          </Box>

          <Box>
            <Text mt="1" color="gray.500">
              {accommodation.Street} {accommodation.StreetNumber}, {accommodation.Zipcode} {accommodation.City}, {accommodation.Country}
            </Text>
            <Text mt="2">
              Min guests: {accommodation.MinGuests} <br/>
              Max guests: {accommodation.MaxGuests}
            </Text>
          </Box>
          { user?.role == 0 &&
          <Box mt="2">
            <Button colorScheme="blue" onClick={handleOpenModal}>Book</Button>
          </Box>
          }
        </Box>
    </Card>
    <BookAccommodationDialog isOpen={isModalOpen} onClose={handleCloseModal} accommodation={accommodation}/>
        </>
    )
}

