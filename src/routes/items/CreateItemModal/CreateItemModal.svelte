<script lang="ts">
    import CreateItemForm from "./CreateItemForm/CreateItemForm.svelte";
    
    let dialog: HTMLDialogElement;
    let form: CreateItemForm;
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
  <div class="modal-box">
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" >
        ✕
      </button>
    </form>

    <CreateItemForm
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