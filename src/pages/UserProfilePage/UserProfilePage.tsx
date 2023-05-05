import { useEffect, useState } from "react";
import { useApplicationStore } from "../../store/application.store";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { displayToast } from "../../utils/toast.caller";
import { useNavigate } from "react-router";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { ChangePasswordForm } from "../../components/ChangePasswordForm/ChangePasswordForm";

type Inputs = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: number;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  country: string;
  username: string;
};

export const UserProfilePage = () => {
  const user = useApplicationStore((state) => state.user);
  const deleteProfile = useApplicationStore((state) => state.deleteProfile);
  const deleteProfileRes = useApplicationStore(
    (state) => state.deleteProfileRes
  );
  const logout = useApplicationStore((state) => state.logout);
  const updatePersonalInfo = useApplicationStore(
    (state) => state.updatePersonalInfo
  );
  const updatePersonalInfoRes = useApplicationStore(
    (state) => state.updatePersonalInfoRes
  );
  const fetchLoggedUser = useApplicationStore((state) => state.fetchLoggedUser);
  const token = useApplicationStore((state) => state.loginStateRes.data);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const handleDeleteProfile = async () => {
    await deleteProfile();
  };

  const defaultValues: Inputs = {
    id: "",
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    email: user?.email ?? "",
    role: user?.role ?? -1,
    street: user?.street ?? "",
    streetNumber: user?.streetNumber ?? "",
    city: user?.city ?? "",
    zipCode: user?.zipCode ?? "",
    country: user?.country ?? "",
    username: user?.username ?? "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const { id, ...existingData } = data;
    await updatePersonalInfo({ id: user?.id ?? "", ...existingData });
    await fetchLoggedUser(token ?? "");
  };

  useEffect(() => {
    if (deleteProfileRes.status === "SUCCESS") {
      displayToast(toast, "Successfully deleted profile!", "success");
      logout();
      navigate("/");
      return;
    }
    if (deleteProfileRes.status === "ERROR") {
      displayToast(toast, deleteProfileRes.error ?? "", "error");
    }
  }, [deleteProfileRes]);

  useEffect(() => {
    if (updatePersonalInfoRes.status === "SUCCESS") {
      displayToast(toast, "Successfully updated personal info!", "success");
      return;
    }
    if (updatePersonalInfoRes.status === "ERROR") {
      displayToast(toast, updatePersonalInfoRes.error ?? "", "error");
    }
  }, [updatePersonalInfoRes]);
  return (
    <Flex justifyContent="center">
      <Flex width="30%" gap="15px" direction="column" padding="30px 0">
        <Input
          defaultValue={defaultValues?.username}
          disabled={!isUpdate}
          placeholder="username"
          {...register("username", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.name}
          disabled={!isUpdate}
          placeholder="name"
          {...register("name", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.surname}
          disabled={!isUpdate}
          placeholder="surname"
          {...register("surname", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.email}
          disabled={!isUpdate}
          placeholder="email"
          {...register("email", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.street}
          disabled={!isUpdate}
          placeholder="street"
          {...register("street", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.streetNumber}
          disabled={!isUpdate}
          placeholder="street number"
          {...register("streetNumber", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.city}
          disabled={!isUpdate}
          placeholder="city"
          {...register("city", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.zipCode}
          disabled={!isUpdate}
          placeholder="zip code"
          {...register("zipCode", { required: true })}
        />
        <Input
          defaultValue={defaultValues?.country}
          disabled={!isUpdate}
          placeholder="country"
          {...register("country", { required: true })}
        />
        <Button disabled={!isUpdate} onClick={onOpen}>
          Change password
        </Button>
        {isUpdate ? (
          <Button onClick={handleSubmit(onSubmit)}>Save</Button>
        ) : (
          <Button onClick={() => setIsUpdate(true)}>Update</Button>
        )}

        <Button colorScheme="red" onClick={handleDeleteProfile}>
          {deleteProfileRes.status != "LOADING" && <p>Delete profile</p>}
          {deleteProfileRes.status === "LOADING" && (
            <Flex justifyContent="center">
              <Spinner size="lg" />
            </Flex>
          )}
        </Button>
      </Flex>
      <ChangePasswordForm
        isOpen={isOpen}
        onClose={onClose}
      ></ChangePasswordForm>
    </Flex>
  );
};
