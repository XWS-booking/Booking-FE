import {
  Box,
  Button,
  Divider,
  Flex,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CreateAccomodationForm } from "../CreateAccomodationForm/CreateAccomodationForm";
import { LoginForm } from "../Auth/LoginForm";

export const Header = () => {
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box width="100%" bg={"#003b95"} p={"10px 25px"}>
        <Flex
          w={"100%"}
          h={"40px"}
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Link href="/">
            <Text color={"white"} fontWeight="700">
              Booking.com
            </Text>
          </Link>
          <Flex gap="15px">
            <Link onClick={onOpenLogin} color={"white"}>
              Login
            </Link>
          </Flex>
        </Flex>
        <Button onClick={onOpen}>Create accommodation</Button>
      </Box>
      <CreateAccomodationForm
        isOpen={isOpen}
        onClose={onClose}
      ></CreateAccomodationForm>
      <LoginForm
        isOpen={isOpenLogin}
        onOpen={onOpenLogin}
        onClose={onCloseLogin}
      />
    </>
  );
};
