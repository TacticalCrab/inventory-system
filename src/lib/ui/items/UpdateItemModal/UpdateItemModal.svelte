<script lang="ts">
    import { page } from "$app/state";
    import { getToastContext } from "$lib/ui/toaster/toast.svelte";
	import type { Item } from "$lib/ui/types/Item";
    import ItemForm from "../ItemForm/ItemForm.svelte";

    const toastState = getToastContext();

    let dialog: HTMLDialogElement;
    let form: ItemForm;

    export function openModal(itemData: Item) {
        form.clear();
        errorMessage = "";
        dialog.showModal();
        form.setData(itemData);
    }

    let errorMessage: string | null = $derived(page?.form?.message);

</script>

<dialog
  bind:this={dialog} 
  class="modal">
  <div class="modal-box max-w-200">
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" >
        ✕
      </button>
    </form>

    <ItemForm
      title="Update Item"
      method="POST"
      action="?/update"
      readonly={false}
      bind:this={form}
      errorMessage={errorMessage}
      onsuccess={() => {
        if (dialog) {
          dialog.close();
          toastState.success("Item Updated!");
        }
      }}/>
  </div>
</dialog>