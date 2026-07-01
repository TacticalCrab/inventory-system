import { setContext, getContext } from "svelte";

interface Toast {
    id: string,
    message: string,
    type: string
}

class ToastState {
    static DEFAULT_DURATION = 3000;

    list: Toast[] = $state([]);

    send(message: string, type: string = "info", duration: number = ToastState.DEFAULT_DURATION) {
        const id = crypto.randomUUID();

        this.list.push({
            id, message, type
        });

        setTimeout(() => {
            this.remove(id)
        }, duration);
    }

    remove(id: string) {
        this.list = this.list.filter(t => t.id !== id);
    }

    success(msg: string, dur: number = ToastState.DEFAULT_DURATION) { this.send(msg, "success", dur); }
    error(msg: string, dur: number = ToastState.DEFAULT_DURATION) { this.send(msg, "error", dur); }
    warning(msg: string, dur: number = ToastState.DEFAULT_DURATION) { this.send(msg, "warning", dur); }
    info(msg: string, dur: number = ToastState.DEFAULT_DURATION) { this.send(msg, "info", dur); }
}

const TOAST_KEY = Symbol('toast');

export function setToastContext(): ToastState {
    const toastState = new ToastState();
    setContext(TOAST_KEY, toastState);

    return toastState;
}

export function getToastContext(): ToastState {
    return getContext(TOAST_KEY);
}