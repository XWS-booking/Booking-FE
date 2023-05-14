import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useApplicationStore } from '../../store/application.store';

type Inputs = {
  oldPassword: string;
  newPassword: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordForm = ({ isOpen, onClose }: Props) => {
  const changePassword = useApplicationStore((state) => state.changePassword);
  const changePasswordRes = useApplicationStore(
    (state) => state.changePasswordRes
  );
  const user = useApplicationStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (changePasswordRes.status === 'SUCCESS') {
      onClose();
      return;
    }
  }, [changePasswordRes]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    await changePassword({
      id: user?.id ?? '',
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>Change password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type='password'
              placeholder='Old password'
              {...register('oldPassword', { required: true })}
              margin='10px 0'
            ></Input>
            <Input
              type='password'
              placeholder='New password'
              {...register('newPassword', { required: true })}
            ></Input>

            <Flex justifyContent='center'>
              <Button type='submit' margin='15px 0'>
                Change password
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
