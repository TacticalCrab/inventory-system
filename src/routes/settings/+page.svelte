<script lang="ts">
	import NamedContainer from "$lib/ui/blocks/NamedContainer.svelte";
    import { enhance } from '$app/forms';
	import TickToggle from "$lib/ui/common/toggle/TickToggle.svelte";
	import type { AppConfig } from "$lib/server/config/config.schema.js";

    let { data } = $props();

    let defaultTheme: AppConfig["defaultTheme"] = $derived(data.config.defaultTheme);
    let defaultThemeChanged = $derived(data.config.defaultTheme !== defaultTheme);

    let notificationCronSchedule: AppConfig["notificationCronSchedule"] = $derived(
        data.config.notificationCronSchedule
    );
    let notificationCronScheduleChanged = $derived(data.config.notificationCronSchedule !== notificationCronSchedule)

    let enableExpireDateNotifications: AppConfig["enableExpireDateNotifications"] = $derived(
        data.config.enableExpireDateNotifications
    );
    let enableExpireDateNotificationsChanged = $derived(data.config.enableExpireDateNotifications !== enableExpireDateNotifications);

</script>
<div>
    <h1 class="text-center mt-2 text-3xl">
        Settings
    </h1>
    <div class="flex justify-center">
        <div class="flex flex-col gap-4 md:p-20 w-fit">
            <form
                method="POST"
                action="?/updateConfig"
                use:enhance
                >
                <NamedContainer title="Theme">
                    <fieldset class="fieldset">
                        <legend class={[
                            "fieldset-legend",
                            defaultThemeChanged && "text-green-400" 
                        ]}>
                            Default theme
                        </legend>
                        <select name="defaultTheme" class="select" bind:value={defaultTheme}>
                            <option value="dark">dark</option>
                            <option value="light">light</option>
                        </select>
                    </fieldset>
                </NamedContainer>

                <NamedContainer title="Notifications">
                    <div>
                        <fieldset class="fieldset">
                            <legend class={[
                                "fieldset-legend",
                                notificationCronScheduleChanged && "text-green-400" 
                            ]}>
                                Cron schema
                            </legend>
                            <input bind:value={notificationCronSchedule} name="notificationCronSchedule" type="text" class="input" placeholder="Type here" />
                        </fieldset>
                        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                            <legend class={[
                                "fieldset-legend",
                                enableExpireDateNotificationsChanged && "text-green-400" 
                            ]}>
                                Toggle notifications
                            </legend>
                            <label class="label">
                                <TickToggle name="enableExpireDateNotifications" bind:checked={enableExpireDateNotifications}/>
                            </label>
                        </fieldset>
                        <!-- 4. Select Notification senders -->
                    </div>
                </NamedContainer>
                <button
                    disabled={!defaultThemeChanged && !notificationCronScheduleChanged && !enableExpireDateNotificationsChanged}
                    type="submit" 
                    class="btn btn-success mt-4 w-full">Save</button>
            </form>
        </div>
    </div>
</div>