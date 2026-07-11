<script lang="ts">
	import type { Snippet } from "svelte";

    const DEFAULT_STYLE = {
        width: 100,
        size: "normal"
    } as const;
    
    let dialog: HTMLDialogElement;

    interface Style {
        width?: 100 | 200;
        size?: "normal" | "fullscreen"
    }

    interface Props {
        style?: Style,
        children?: Snippet;
    }

    const {
        children,
        style = DEFAULT_STYLE
    }: Props = $props();

    export async function openModal() {
        dialog.showModal();
    }

    export async function close() {
        dialog.close();
    }
</script>

<dialog
  bind:this={dialog} 
  class="modal">
  <div class={[
    "modal-box overflow-y-auto max-h-[80vh]",
    [
        style.width === 100 && "max-w-100",
        style.width === 200 && "max-w-200",
        style.size === "fullscreen" && "max-w-none w-screen h-screen"
    ]
  ]}>
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" >
        ✕
      </button>
    </form>
    {#if children}
        {@render children()}
    {/if}
  </div>
</dialog>