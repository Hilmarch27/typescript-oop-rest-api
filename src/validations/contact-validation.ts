import { z, ZodType } from "zod";

export class ContactValidations {
  static CRETAE: ZodType = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });
}
