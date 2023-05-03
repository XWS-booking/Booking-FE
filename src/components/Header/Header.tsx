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
import { useApplicationStore } from "../../store/application.store";

export const Header = () => {
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = useApplicationStore((state) => state.token);
  const logout = useApplicationStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            {token == null && (
              <Link onClick={onOpenLogin} color={"white"}>
                Login
              </Link>
            )}

            {token != null && (
              <Link color={"white"} onClick={handleLogout}>
                Logout
              </Link>
            )}
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
