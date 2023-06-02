import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useApplicationStore } from '../../store/application.store';
import { HostRate } from '../../store/ratings-store/types/hostRate';
import { BsFillTrashFill } from 'react-icons/bs';
import { RateForm } from '../../components/Rating/RateForm';

export const HostPage = () => {
  const location = useLocation();
  const owner = location.state?.data;

  const getHostRatings = useApplicationStore((state) => state.getHostRatings);
  const hostRatings = useApplicationStore((state) => state.hostRatings);
  const loggedUser = useApplicationStore((state) => state.user);
  const deleteHostRating = useApplicationStore(
    (state) => state.deleteHostRating
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getHostRatings(owner.id);
  }, [isOpen]);

  const handleDeleteRating = async (rating: HostRate) => {
    await deleteHostRating(rating.Id);
    await getHostRatings(owner.id);
  };

  return (
    <Flex
      direction={'column'}
      alignItems={'center'}
      padding={'30px 0'}
      gap={'30px'}
    >
      <Flex gap={'15px'}>
        <Text fontSize={'24px'}>
          {owner.name} {owner.surname}
        </Text>
        <Flex
          bg={'blue'}
          width={'40px'}
          height={'40px'}
          textColor={'white'}
          fontSize={'20px'}
          textAlign={'center'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'10px'}
        >
          {hostRatings.data?.AverageRate ?? '/'}
        </Flex>
        {!hostRatings.data?.ratings
          ?.map((rating) => rating.GuestId)
          .includes(loggedUser?.id ?? '') && (
          <>
            <Button onClick={onOpen}>Rate</Button>
            <RateForm
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              flag='NEW'
              host={owner.id}
            ></RateForm>
          </>
        )}
      </Flex>

      {hostRatings &&
        hostRatings.data?.ratings?.map((rating: HostRate) => (
          <Flex
            key={rating.Id}
            direction={'column'}
            minWidth={'400px'}
            alignItems={'center'}
            boxShadow={'rgba(149, 157, 165, 0.2) 0px 8px 24px;'}
            padding={'30px'}
            gap={'15px'}
          >
            <Flex gap={'20px'} alignItems={'center'}>
              <Flex
                bg={'blue'}
                width={'40px'}
                height={'40px'}
                textColor={'white'}
                fontSize={'20px'}
                textAlign={'center'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'10px'}
              >
                {rating.Rating}
              </Flex>
              <Text fontSize={'20px'}>
                {rating.GuestFirstName} {rating.GuestLastName}
              </Text>
              <Text color={'gray'}>
                {new Date(rating.Time.seconds * 1000).toDateString()}
              </Text>
            </Flex>
            {hostRatings.data?.ratings
              ?.map((rating) => rating.GuestId)
              .includes(loggedUser?.id ?? '') && (
              <Flex gap={'10px'}>
                <Button onClick={onOpen}>Update</Button>
                <Button onClick={() => handleDeleteRating(rating)}>
                  <BsFillTrashFill
                    color='red'
                    fontSize={'18px'}
                  ></BsFillTrashFill>
                </Button>
                <RateForm
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onClose={onClose}
                  hostRate={rating}
                  flag='UPDATE'
                  host={owner.id}
                ></RateForm>
              </Flex>
            )}
          </Flex>
        ))}
    </Flex>
  );
};
