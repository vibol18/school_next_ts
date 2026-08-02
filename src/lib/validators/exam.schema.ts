import { z } from "zod"; export const examSchema = z.object({ title: z.string(), date: z.string() });
