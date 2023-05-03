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

export const Header = () => {
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
        </Flex>
        <Button onClick={onOpen}>Create accommodation</Button>
      </Box>
      <CreateAccomodationForm
        isOpen={isOpen}
        onClose={onClose}
      ></CreateAccomodationForm>
    </>
  );
};
