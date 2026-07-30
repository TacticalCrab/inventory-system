export enum MessageType {
    DEBUG = "DEBUG",
    INFO = "INFO",
    ALL = "ALL"
}

export interface NotificationSender {
    send(message: string, messageType?: MessageType): Promise<void> | void;
    getAvailableMessageTypes(): Set<MessageType> | MessageType.ALL;
}

export class Notifier {
    private senders: Set<NotificationSender> = new Set();
    private static _instance: Notifier | null = null;

    private constructor() {};

    static getInstance() {
        if (!Notifier._instance) {
            Notifier._instance = new Notifier();
        }

        return Notifier._instance;
    }

    registerSender(sender: NotificationSender) {
        this.senders.add(sender)

        return this;
    }

    async sendMessage(message: string, messageType: MessageType = MessageType.INFO) {
        for (const sender of this.senders) {
            const availableMessageTypes = sender.getAvailableMessageTypes();

            if (availableMessageTypes === MessageType.ALL || availableMessageTypes.has(messageType)) {
                sender.send(message);
            }
        }
    }
}