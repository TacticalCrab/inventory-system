import { env } from '$env/dynamic/private';
import { MessageType, type NotificationSender } from "../Notifier";

export class NtfySender implements NotificationSender {
    private availableMessageTypes: Set<MessageType> = new Set([MessageType.INFO]);
    private channel: string | null = null;

    constructor() {
        if (!env.NTFY_CHANNEL) {
            console.error("Env not NTFY_CHANNEL not set.");
            return;
        }

        this.channel = env.NTFY_CHANNEL || null;
    }

    getAvailableMessageTypes() {
        return this.availableMessageTypes;
    }

    async send(message: string): Promise<void> {
        if (this.channel === null) {
            console.error("Channel not defined skipping NTFY.")
            return;
        }

        const response = await fetch(`https://ntfy.sh/${this.channel}`, {
            method: "POST",
            body: message
        });

        if (!response.ok) {
            console.error("Something went wrong", response.status, response.statusText);
        }
    }
}