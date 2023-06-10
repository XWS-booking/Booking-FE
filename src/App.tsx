import './App.css';
import { Box, Button, Flex, Img, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useApplicationStore } from './store/application.store';
import io from 'socket.io-client';

function App() {

  const loginStateRes = useApplicationStore((state) => state.loginStateRes)

  const connectToServer = () => {
    const token = loginStateRes.data
    const socket = io('http://localhost:8080', {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        },
      },
    }
    },);
    console.log("connected to server")
    socket.on('notification', (notification) => {
      toast.info(notification.message, { autoClose: false })
    });
  
    return socket;
  }


  useEffect(() => {
    console.log(loginStateRes.data)
    if (loginStateRes.data) {
      const socket = connectToServer();
      return () => {
        console.log("Disconnected from the server")
        socket.disconnect();
      };
    }
  }, [loginStateRes]);


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
