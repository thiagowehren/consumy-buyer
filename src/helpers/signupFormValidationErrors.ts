import { formErrorMessages } from "@/helpers/constants/authFormErrorMessages";

export function validateInputs(email: string, password: string, confirmedPassword: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    console.log("1")
    if (!emailRegex.test(email)) {
        return formErrorMessages.email.invalid;
    }
    console.log("2")
    
    if (!password || password.length < 6) {
        return formErrorMessages.password.minLength;
    }
    console.log("3")
    
    if (confirmedPassword !== password) {
        return formErrorMessages.confirmPassword.match
    }
    console.log("4")

    return "";
}