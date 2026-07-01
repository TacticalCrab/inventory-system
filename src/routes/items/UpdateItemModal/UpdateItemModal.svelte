<script lang="ts">
	import type { ItemData } from "../ItemCard/ItemCard.svelte";
    import ItemForm from "../ItemForm/ItemForm.svelte";
    
    let dialog: HTMLDialogElement;
    let form: ItemForm;

    export function openModal(itemData: ItemData) {
        form.clear();
        dialog.showModal();
        form.setData(itemData);
    }
</script>

<button class="btn" onclick={() => {
  if (dialog) {
    form.clear()
    dialog.showModal();
  }
}}>
  open modal
</button>
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
      readonly={true}
      bind:this={form} 
      onsubmit={() => {
        if (dialog) {
          dialog.close();
        }
      }}/>
  </div>
</dialog>