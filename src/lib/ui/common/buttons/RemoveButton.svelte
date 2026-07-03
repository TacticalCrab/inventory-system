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
    aria-label="Remove item"
    title="Remove item"
    onclick={onclick}
    class="btn btn-sm btn-circle text-error hover:bg-error/10">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
    </svg>
</button>