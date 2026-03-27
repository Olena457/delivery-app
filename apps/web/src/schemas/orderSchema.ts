import * as yup from "yup";
import {
  NAME_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  ADDRESS_REGEX,
} from "../utils/constants/regex";

export const orderSchema = yup
  .object({
    userName: yup
      .string()
      .required("Name is required")
      .matches(NAME_REGEX, "Name contains invalid characters"),

    userEmail: yup
      .string()
      .required("Email is required")
      .matches(EMAIL_REGEX, "Invalid email format"),

    userPhone: yup
      .string()
      .required("Phone is required")
      .matches(PHONE_REGEX, "Phone must be 10-15 digits"),

    address: yup
      .string()
      .required("Address is required")
      .matches(
        ADDRESS_REGEX,
        "Address is too short or contains invalid characters",
      )
      .min(5, "Address must be at least 5 characters"),
  })
  .required();
