import { Box, Button, Flex, Link, Text, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CreateAccomodationForm } from '../CreateAccomodationForm/CreateAccomodationForm';
import { LoginForm } from '../Auth/LoginForm';
import { useApplicationStore } from '../../store/application.store';
import { RegistrationForm } from '../Auth/RegistrationForm';

export const Header = () => {
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRegistration,
    onOpen: onOpenRegistration,
    onClose: onCloseRegistration,
  } = useDisclosure();
  const user = useApplicationStore((state) => state.user);
  const logout = useApplicationStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Box width='100%' bg={'#003b95'} p={'10px 25px'}>
        <Flex
          w={'100%'}
          h={'40px'}
          alignItems={'center'}
          justifyContent='space-between'
        >
          <Link href='/'>
            <Text color={'white'} fontWeight='700'>
              Booking.com
            </Text>
          </Link>
          <Flex gap='15px'>
            {!user && (
              <Link color={'white'} onClick={onOpenRegistration}>
                Register
              </Link>
            )}

            {user ? (
              <Link color={'white'} onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <Link onClick={onOpenLogin} color={'white'}>
                Login
              </Link>
            )}
          </Flex>
        </Flex>
        <Button onClick={() => navigate('/accommodations')} mr='5px'>
          Accommodations
        </Button>
        {user?.role == 1 && (
          <Button onClick={onOpen} mr='5px'>
            Create accommodation
          </Button>
        )}
        {user?.role == 0 && (
          <Button onClick={() => navigate('/guest/reservations')} mr='5px'>
            Reservations
          </Button>
        )}
        {user?.role == 1 && (
          <Button onClick={() => navigate('/owner/reservations')} mr='5px'>
            Reservations
          </Button>
        )}
      </Box>
      <CreateAccomodationForm isOpen={isOpen} onClose={onClose} />
      <LoginForm
        isOpen={isOpenLogin}
        onOpen={onOpenLogin}
        onClose={onCloseLogin}
      />
      <RegistrationForm
        isOpen={isOpenRegistration}
        onOpen={onOpenRegistration}
        onClose={onCloseRegistration}
      />
    </>
  );
};
