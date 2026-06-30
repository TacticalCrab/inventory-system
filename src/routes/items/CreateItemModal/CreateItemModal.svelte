<script lang="ts">
    import ItemForm from "../ItemForm/ItemForm.svelte";
    
    let dialog: HTMLDialogElement;
    let form: ItemForm;
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
      method="POST"
      action="?/create"
      bind:this={form} 
      onsubmit={() => {
        if (dialog) {
          dialog.close();
        }
      }}/>
  </div>
</dialog>