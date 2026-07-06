<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props {
        type?: HTMLButtonAttributes["type"];
        onclick?(): void;
    }

    const {
        type = "button",
        onclick
    }: Props = $props();
</script>

<button 
    type={type}
    aria-label="Add to location"
    title="Add to location"
    onclick={onclick}
    class="btn btn-sm btn-circle text-success hover:bg-success/10">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
</button>