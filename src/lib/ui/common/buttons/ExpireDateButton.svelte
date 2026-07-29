<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props {
		type?: HTMLButtonAttributes["type"];
		title?: string;
		onclick?(): void;
	}

	const {
		type = "button",
		title = "Change expiry date",
		onclick
	}: Props = $props();
</script>

<button
	{type}
	aria-label={title}
	{title}
	{onclick}
	class="btn btn-sm btn-circle text-warning hover:bg-warning/10"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-5"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 4.5h13.5A1.5 1.5 0 0 1 20.25 6v12a1.5 1.5 0 0 1-1.5 1.5H5.25A1.5 1.5 0 0 1 3.75 18V6a1.5 1.5 0 0 1 1.5-1.5Z"
		/>

		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="m14.25 16.5 3.75-3.75a1.06 1.06 0 0 1 1.5 1.5L15.75 18l-2.25.75.75-2.25Z"
		/>
	</svg>
</button>