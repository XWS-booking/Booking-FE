import * as yup from 'yup';

export const LOGIN_VALIDATION_SCHEMA = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});

export const REGISTRATION_VALIDATION_SCHEMA = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  name: yup.string().required(),
  surname: yup.string().required(),
  street: yup.string().required(),
  streetNumber: yup.string().required(),
  city: yup.string().required(),
  zipCode: yup.string().required(),
  country: yup.string().required(),
  username: yup.string().required(),
});

export const LOGIN_DEFAULT_VALUES = {
  email: '',
  password: '',
};

export const REGISTRATION_DEFAULT_VALUES = {
  email: '',
  password: '',
  name: '',
  surname: '',
  street: '',
  streetNumber: '',
  city: '',
  zipCode: '',
  country: '',
  username: '',
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};
