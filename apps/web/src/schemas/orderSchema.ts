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
      .trim()
      .required("Name is required")
      .matches(NAME_REGEX, "Name contains invalid characters"),

    userEmail: yup
      .string()
      .trim()
      .required("Email is required")
      .matches(EMAIL_REGEX, "Invalid email format"),

    userPhone: yup
      .string()
      .trim()
      .required("Phone is required")
      .matches(PHONE_REGEX, "Phone must be 10-15 digits"),

    address: yup
      .string()
      .trim()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters")
      .matches(ADDRESS_REGEX, "Address contains invalid characters"),

    items: yup
      .array()
      .of(
        yup.object({
          productId: yup.number().integer().positive().required(),
          quantity: yup
            .number()
            .integer()
            .min(1, "Min quantity is 1")
            .required(),
        }),
      )
      .min(1, "Cart cannot be empty")
      .required("Items are required"),

    totalPrice: yup
      .number()
      .positive("Total price must be positive")
      .required("Total price is required"),
  })
  .required();

/** Form fields only — cart lines and total are supplied on submit */
export const checkoutFieldsSchema = orderSchema.pick([
  "userName",
  "userEmail",
  "userPhone",
  "address",
]);
