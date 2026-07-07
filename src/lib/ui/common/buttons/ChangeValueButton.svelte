<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props {
        type?: HTMLButtonAttributes["type"];
        title?: string;
        onclick?(): void;
    }

    const {
        type = "button",
        title = "Change quantity",
        onclick
    }: Props = $props();
</script>

<button 
    {type}
    aria-label={title}
    {title}
    {onclick}
    class="btn btn-sm btn-circle text-info hover:bg-info/10">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v10m5-5H7" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M7 18.5h10" />
    </svg>
</button>