import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useApplicationStore } from "../../store/application.store";
import { Accommodation } from "../../store/accommodation-store/types/accommodation.type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Inputs = {
  name: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  country: string;
  wifi: boolean;
  kitchen: boolean;
  airConditioner: boolean;
  freeParking: boolean;
  minGuests: number;
  maxGuests: number;
  pictures?: FileList | null;
};

export const CreateAccomodationForm = ({ isOpen, onClose }: Props) => {
  const [pictures, setPictures] = useState<FileList | null>();
  const createAccommodation = useApplicationStore(
    (state) => state.createAccommodation
  );
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.pictures = pictures;
    await createAccommodation(data as unknown as Accommodation);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Create accomodation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              placeholder="Name"
              {...register("name")}
              margin="5px 0"
            ></Input>
            <Input
              type="text"
              placeholder="Street"
              {...register("street")}
              margin="5px 0"
            ></Input>
            <Input
              type="text"
              placeholder="Street number"
              {...register("streetNumber")}
              margin="5px 0"
            ></Input>
            <Input
              type="text"
              placeholder="City"
              {...register("city")}
              margin="5px 0"
            ></Input>
            <Input
              type="text"
              placeholder="Zip code"
              {...register("zipCode")}
              margin="5px 0"
            ></Input>
            <Input
              type="text"
              placeholder="Country"
              {...register("country")}
            ></Input>
            <Stack spacing={5} direction="row" margin="5px 0">
              <Checkbox {...register("wifi")}>Wifi</Checkbox>
              <Checkbox {...register("kitchen")}>Kitchen</Checkbox>
              <Checkbox {...register("airConditioner")}>
                Air conditioner
              </Checkbox>
              <Checkbox {...register("freeParking")}>Free parking</Checkbox>
            </Stack>
            <Input
              type="number"
              placeholder="Minimum guests"
              {...register("minGuests")}
              margin="5px 0"
            ></Input>
            <Input
              type="number"
              placeholder="Maximum guests"
              {...register("maxGuests")}
              margin="5px 0"
            ></Input>
            <Input
              type="file"
              multiple
              onChange={(e) => setPictures(e.target.files)}
              margin="5px 0"
            ></Input>
            <Flex justifyContent="center">
              <Button type="submit" margin="15px 0">
                Create accommodation
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
