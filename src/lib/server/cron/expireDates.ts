import cron, { type ScheduledTask } from 'node-cron';
import { db } from '../db';
import { item, itemProperty } from '../db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
import { computeDaysLeft } from '$lib/common/date';
import { Notifier } from '../common/Notifier';
import { ConfigProvider } from '../config/ConfigProvider';


const createExpireDatesTask = (schedule: string) => {
    return cron.createTask(schedule, async () => {
        const items = await db
            .select({
                id: item.id,
                name: item.name,
                expireDate: itemProperty.value
            })
            .from(item)
            .leftJoin(
                itemProperty,
                and(
                    eq(itemProperty.itemId, item.id),
                    eq(itemProperty.name, "#expire_date")
                )
            ).where(
                isNotNull(itemProperty.value)
            );
        
        const today = new Date();
        let expiresMessage = "";
        let overdueMessage = "";

        for (const item of items) {
            const daysLeft = computeDaysLeft(item.expireDate, today);

            if (0 < daysLeft && daysLeft < 3) {
                expiresMessage += `⏳  ${item.id}. ${item.name} ${item.expireDate} ${daysLeft} days\n`;
            }

            if (daysLeft < 0) {
                overdueMessage += `⚠️  ${item.id}. ${item.name} ${item.expireDate} ${Math.abs(daysLeft)} days\n`;
            }
        }

        const message = `Expires Soon:\n${expiresMessage}Overdue:\n${overdueMessage}`;

        const notifier = Notifier.getInstance();
        notifier.sendMessage(message);
    });
}

export const expireDatesCron = () => {
    const config = ConfigProvider.getInstance();

    let currentTask: ScheduledTask | undefined;
    config.onInit((config) => {
        if (config.enableExpireDateNotifications) {
            currentTask = createExpireDatesTask(config.notificationCronSchedule);
            currentTask.start();
        }
    });

    config.onChange((config) => {
        if (config.enableExpireDateNotifications) {
            currentTask?.destroy();
            currentTask = createExpireDatesTask(config.notificationCronSchedule);
            currentTask.start();
            return;
        }

        currentTask?.destroy();
        currentTask = undefined;
    });
}