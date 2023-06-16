import { Box, Button, Collapse, Flex, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Accommodation } from '../../store/accommodation-store/types/accommodation.type';
import { useApplicationStore } from '../../store/application.store';
import { AccommodationCard } from './AccommodationCard';

export const Recommendation = () => {
  const getRecommended = useApplicationStore(
    (state) => state.getRecommendedAccommodations
  );
  const { isOpen, onToggle } = useDisclosure();
  const [accommodations, setAccommodations] = useState<Accommodation[]>();

  const toggleRecommended = () => {
    onToggle();
  };

  useEffect(() => {
    getRecommended()
      .then((res) => setAccommodations(res))
      .catch(console.log);
  }, []);

  return (
    <Flex
      border='1px solid lightgray'
      position={'fixed'}
      bottom='0'
      left='0'
      zIndex='1000000'
      background='white'
      direction='column'
      alignItems='center'
      padding='10px'
    >
      <Button colorScheme='blue' onClick={toggleRecommended}>
        Recommended for you
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Box overflowY='scroll' gap='10px' maxH='500px'>
          {accommodations?.map((accommodation) => (
            <AccommodationCard
              key={accommodation?.id}
              accommodation={accommodation}
            />
          ))}
        </Box>
      </Collapse>
    </Flex>
  );
};
