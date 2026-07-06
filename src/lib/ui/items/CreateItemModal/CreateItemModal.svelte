<script lang="ts">
	import CreateButton from "$lib/ui/common/buttons/CreateButton.svelte";
    import { getToastContext } from "$lib/ui/toaster/toast.svelte";
    import ItemForm from "../ItemForm/ItemForm.svelte";

    const toastState = getToastContext();

    let dialog: HTMLDialogElement;
    let form: ItemForm;
</script>


<CreateButton
  onclick={() => {
    if (dialog) {
      form.clear()
      dialog.showModal();
    }
  }}
/>
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
      title="Create Item"
      method="POST"
      action="?/create"
      bind:this={form} 
      onsuccess={() => {
        if (dialog) {
          dialog.close();
          toastState.success("Item Created!");
        }
      }}/>
  </div>
</dialog>