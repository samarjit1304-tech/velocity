import { z } from 'zod';

// Login Validation Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address configuration' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

// Registration Validation Schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Confirmation password is required' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Address Manager Schema
export const addressSchema = z.object({
  street: z.string().min(5, { message: 'Street address must be detailed' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State or region is required' }),
  postalCode: z.string().min(4, { message: 'Postal/Zip code is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
  isDefault: z.boolean().optional()
});

// Checkout Shipping Address Schema
export const checkoutShippingSchema = z.object({
  name: z.string().min(2, { message: 'Recipient name is required' }),
  phone: z.string().min(10, { message: 'Contact phone must be at least 10 digits' }),
  street: z.string().min(5, { message: 'Delivery address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State/Region is required' }),
  postalCode: z.string().min(4, { message: 'Postal/Zip code is required' }),
  country: z.string().min(2, { message: 'Country is required' })
});
