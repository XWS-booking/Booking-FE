import * as yup from "yup"

export const LOGIN_VALIDATION_SCHEMA = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8)
})

export const LOGIN_DEFAULT_VALUES = {
    email: "",
    password: ""
}

export const REGISTER_DEFAULT_VALUES = {
    email: "",
    password: "",
    name: "",
    surname: ""
}