import type { Handle, ServerInit } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { Notifier } from '$lib/server/common/Notifier';
import { NtfySender } from '$lib/server/common/NotificationSenders/NtfySender';
import { ConsoleSender } from '$lib/server/common/NotificationSenders/ConsoleSender';
import initCron from "$lib/server/cron";


export const init: ServerInit = async () => {
    console.log('Initializing server...');

    const notifier = Notifier.getInstance();
	notifier
		.registerSender(new NtfySender())
		.registerSender(new ConsoleSender());

	initCron();
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
