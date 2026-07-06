<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props {
        type?: HTMLButtonAttributes["type"];
        title?: string;
        onclick?(): void;
    }

    const {
        type = "button",
        title = "Copy",
        onclick
    }: Props = $props();
</script>

<button 
    type={type}
    aria-label={title}
    title={title}
    onclick={onclick}
    class="btn btn-sm btn-circle text-info hover:bg-info/10">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
    </svg>
</button>