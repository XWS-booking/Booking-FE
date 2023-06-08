import './App.css';
import { Box, Button, Flex, Img, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useApplicationStore } from './store/application.store';

function App() {

  const user = useApplicationStore((state) => state.user)

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws'); 

    socket.addEventListener('open', () => {
      console.log('WebSocket connection established.');
    });

    socket.addEventListener('message', (event) => {
      const notification = JSON.parse(event.data);
      console.log('Received notification:', notification);

      if (user?.id == notification.recipient) 
        toast.info(notification.message);
    });

    return () => {
      socket.close();
      console.log("closed socket")
    };
  }, []);


  return (
    <Flex w='100%' h='100%' minH='100vh' direction='column'>
      <Header></Header>
      <Box>
        <Outlet />
      </Box>
      <Footer></Footer>
      <ToastContainer position={'bottom-right'} />
    </Flex>
  );
}

export default App;
