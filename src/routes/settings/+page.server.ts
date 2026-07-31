import type { AppConfig } from "$lib/server/config/config.schema";
import { ConfigProvider } from "$lib/server/config/ConfigProvider"
import type { Actions } from "@sveltejs/kit";

export const load = async () => {
    const config = ConfigProvider.getInstance().getConfig();

    return {
        config
    };
}

export const actions: Actions = {
    updateConfig: async ({request}) => {
        const configData = await request.formData();
        const newConfig: AppConfig = {
            defaultTheme: configData.get("defaultTheme") as AppConfig["defaultTheme"],
            notificationCronSchedule: configData.get("notificationCronSchedule") as string,
            enableExpireDateNotifications: configData.get("enableExpireDateNotifications") as string === "true"
        }

        const config = ConfigProvider.getInstance();
        await config.setConfig(newConfig);
    }
}