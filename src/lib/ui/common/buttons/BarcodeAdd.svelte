<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props {
        type?: HTMLButtonAttributes["type"];
        title?: string;
        onclick?(): void;
    }

    const {
        type = "button",
        title = "Scan barcode",
        onclick
    }: Props = $props();
</script>

<button 
    type={type}
    aria-label={title}
    title={title}
    onclick={onclick}
    class="btn btn-sm btn-circle text-success hover:bg-success/10 transition-colors"
>
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
        <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10-2h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2v-2" />
        
        <rect x="6" y="7" width="1.5" height="10" rx="0.5" />
        <rect x="8.5" y="7" width="1" height="10" rx="0.5" />
        <rect x="10.5" y="7" width="2.5" height="10" rx="0.5" />
        <rect x="14" y="7" width="1" height="10" rx="0.5" />
        <rect x="16" y="7" width="2" height="10" rx="0.5" />
    </svg>
</button>