<script lang="ts">
    import { getToastContext } from "./toast.svelte";
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    const toastState = getToastContext();

    const alertTypes: Record<string, string> = {
        info: 'alert-info',
        success: 'alert-success',
        warning: 'alert-warning',
        error: 'alert-error'
    };
</script>

<div class="toast toast-end toast-bottom z-50 p-4">
    {#each toastState.list as toast (toast.id)}
        <div 
        animate:flip={{ duration: 200 }}
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 500 }}
        class="alert shadow-lg {alertTypes[toast.type] || 'alert-info'}"
        >
        <div>
            <span>{toast.message}</span>
        </div>
        <button 
            class="btn btn-sm btn-ghost btn-circle" 
            onclick={() => toastState.remove(toast.id)}
        >
            ✕
        </button>
        </div>
    {/each}
</div>