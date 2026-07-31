import { CronExpressionParser } from "cron-parser";
import * as z from "zod";

export const cronSchema = z.string().trim().refine(
    (value) => {
        try {
            CronExpressionParser.parse(value, {
                strict: true
            });

            return true;
        } catch (error) {
            console.error("Cron value:", JSON.stringify(value));
            console.error("Cron error:", error);
            return false;
        }
    },
    {
        message: "Invalid cron schedule"
    }
);


export const configSchema = z.object({
    defaultTheme: z.union([z.literal("light"), z.literal("dark")]),
    notificationCronSchedule: cronSchema,
    enableExpireDateNotifications: z.boolean(),
});

export type AppConfig = z.infer<typeof configSchema>;