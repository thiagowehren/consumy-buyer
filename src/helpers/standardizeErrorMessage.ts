import { APIErrorMessages } from "@/helpers/constants/APIErrorMessages";
import { HTTPError } from "@/helpers/HTTPError";

export const standardizeErrorMessage = (error: Error): string => {
  if (error instanceof HTTPError) {
    switch (error.status) {
        case 401:
            return APIErrorMessages.standard.unauthorized;
        case 404:
            return APIErrorMessages.standard.notFound;
        case 422:
            return APIErrorMessages.standard.unprocessable;
        default:
            return `[default] An unexpected HTTP Error occurred! STATUS ${error.status}`;
    }
  } else {
    return `[default] An unexpected non-HTTP error occurred: ${error.toString()}`;
  }
};
