<script lang="ts">
	import CreateButton from "$lib/ui/common/buttons/CreateButton.svelte";
	import Modal from "$lib/ui/common/Modal.svelte";
    import { getToastContext } from "$lib/ui/toaster/toast.svelte";
    import ItemForm from "../ItemForm/ItemForm.svelte";

    const toastState = getToastContext();

    let dialog: Modal;
    let form: ItemForm;
</script>


<CreateButton
  onclick={() => {
    if (dialog) {
      form.clear()
      dialog.openModal();
    }
  }}
/>
<Modal 
  bind:this={dialog}
  style={{
    width: 200
  }}
  >
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
</Modal>