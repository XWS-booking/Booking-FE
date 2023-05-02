import './App.css';
import { Box, Button, Flex, Img, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

function App() {
  return (
    <Flex
      w='100%'
      h='100%'
      minH='100vh'
      direction='column'
    >
      <Header></Header>
      <Box>
        <Outlet/>
      </Box>
      <Footer></Footer>
    </Flex>
  );
}

export default App;
