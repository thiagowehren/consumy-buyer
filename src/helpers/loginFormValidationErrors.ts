import { formErrorMessages } from "@/helpers/constants/authFormErrorMessages";

export function validateInputs(email: string, password: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(email)) {
        return formErrorMessages.email.invalid;
    }

    if (!password || password.length < 6) {
        return formErrorMessages.password.minLength
    }

    return "";
}