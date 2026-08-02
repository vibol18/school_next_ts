import { z } from "zod"; export const feeSchema = z.object({ amount: z.number(), studentId: z.string() });
