import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Heading, Spinner, Switch, VStack, useColorModeValue } from '@chakra-ui/react';
import { useApplicationStore } from '../../store/application.store';
import { NotificationType } from '../../store/notification-store/types/notification.type';

export const NotificationPage = () => {
  const getNotificationPreferences = useApplicationStore((state) => state.getNotificationPreferences)
  const getNotificationPrefRes = useApplicationStore((state) => state.getNotificationPrefRes)
  const updateNotificationPreferences = useApplicationStore((state) => state.updateNotificationPreferences)
  const [notification, setNotification] = useState<NotificationType>({});
  const user = useApplicationStore((state) => state.user)

  useEffect(() => {
   fetchNotificationPrefs()
  }, []);

  useEffect(() => {
    setNotification(getNotificationPrefRes.data ?? {})
  }, [getNotificationPrefRes])
  const fetchNotificationPrefs = async () => {
    await getNotificationPreferences();
  };

  const handleToggle = async (field: keyof NotificationType) => {
    const updatedPrefs = { ...notification, [field]: !notification[field] }
    await updateNotificationPreferences(updatedPrefs)
    setNotification(updatedPrefs);
  };

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('teal.800', 'teal.200');

  return (
    <Box bg={bgColor} p={4} rounded="md" borderWidth="1px" borderColor={borderColor}>
       <Heading as="h2" size="md" fontWeight="bold" color={headingColor} mb={4}>
        Notification Preferences
      </Heading>
      { user?.role == 0 &&
          <VStack spacing={2} align="start" mt={4}>
            <Switch
              isChecked={notification.hostConfirmedOrRejectedReservation}
              onChange={() => handleToggle('hostConfirmedOrRejectedReservation')}
            >
              Host responded to the reservation request
            </Switch>
         </VStack>
      }
      { user?.role == 1 && 
      <VStack spacing={2} align="start" mt={4}>
        <Switch
          isChecked={notification.guestCreatedReservationRequest}
          onChange={() => handleToggle('guestCreatedReservationRequest')}
        >
          Guest created reservation request
        </Switch>
        <Switch
          isChecked={notification.guestCanceledReservation}
          onChange={() => handleToggle('guestCanceledReservation')}
        >
          Guest canceled reservation
        </Switch>
        <Switch
          isChecked={notification.guestRatedAccommodation}
          onChange={() => handleToggle('guestRatedAccommodation')}
        >
          Guest rated accommodation
        </Switch>
        <Switch
          isChecked={notification.guestRatedHost}
          onChange={() => handleToggle('guestRatedHost')}
        >
          Guest rated host
        </Switch>
        <Switch
          isChecked={notification.distinguishedHost}
          onChange={() => handleToggle('distinguishedHost')}
        >
          Distinguished host
        </Switch>
      </VStack>
    }
    </Box>
  );
}
