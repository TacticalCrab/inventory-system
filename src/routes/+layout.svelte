<script lang="ts">
	import './layout.css';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import ToastContainer from '$lib/ui/toaster/ToastContainer.svelte';
	import { setToastContext } from '$lib/ui/toaster/toast.svelte';

	setToastContext();

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-10">
	<a 
		href={resolve("/")}
		class="btn btn-ghost text-xl">
		Inventory System
	</a>
	<div class="ml-4">
		<a href={resolve('/items')} aria-label="items">
			Items
		</a>
	</div>
</div>
{@render children()}

<ToastContainer />
