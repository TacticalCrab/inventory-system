import { MessageType, type NotificationSender } from "../Notifier";

export class ConsoleSender implements NotificationSender {
    send(message: string): Promise<void> | void {
        console.log(message);
    }

    getAvailableMessageTypes(): MessageType.ALL {
        return MessageType.ALL;
    }
}