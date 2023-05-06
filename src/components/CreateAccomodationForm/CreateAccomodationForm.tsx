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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useApplicationStore } from "../../store/application.store";

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
  autoReservation: boolean;
  minGuests: number;
  maxGuests: number;
  pictures?: FileList | null;
};

export const CreateAccomodationForm = ({ isOpen, onClose }: Props) => {
  const [pictures, setPictures] = useState<FileList | null>();
  const createAccommodation = useApplicationStore(
    (state) => state.createAccommodation
  );
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { pictures: pics, ...existingDate } = data;
    await createAccommodation({
      ...existingDate,
      pictures: pictures ?? new FileList(),
    });
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
            <Wrap spacing={5} py={"3"} direction="row" margin="5px 0">
              <WrapItem>
                <Checkbox {...register("wifi")}>Wifi</Checkbox>
              </WrapItem>
              <WrapItem>
                <Checkbox {...register("kitchen")}>Kitchen</Checkbox>
              </WrapItem>
              <WrapItem>
                <Checkbox {...register("autoReservation")}>
                  Automatic Reservation
                </Checkbox>
              </WrapItem>
              <WrapItem>
                <Checkbox {...register("airConditioner")}>
                  Air conditioner
                </Checkbox>
              </WrapItem>
              <WrapItem>
                <Checkbox {...register("freeParking")}>Free parking</Checkbox>
              </WrapItem>
            </Wrap>
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
