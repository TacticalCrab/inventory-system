<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import ToastContainer from '$lib/ui/toaster/ToastContainer.svelte';
	import { setToastContext } from '$lib/ui/toaster/toast.svelte';

	setToastContext();

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<ToastContainer />
