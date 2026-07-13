<script lang="ts">
    import { page } from "$app/state";
    import Modal from "$lib/ui/common/Modal.svelte";
    import { getToastContext } from "$lib/ui/toaster/toast.svelte";
    import type { Item } from "$lib/ui/types/Item";
    import ItemForm from "../ItemForm/ItemForm.svelte";

    interface Props {
        action: `?/${string}`;
    }

    const {
        action
    }: Props = $props();


    const toastState = getToastContext();

    let dialog: Modal;
    let form: ItemForm;

    export function openModal(itemData: Item) {
        form.clear();
        errorMessage = "";
        dialog.openModal();
        form.setData(itemData);
    }

    let errorMessage: string | null = $derived(page?.form?.message);

</script>

<Modal 
  bind:this={dialog}
  style={{
    width: 200
  }}
  >
    <ItemForm
      title="Update Item"
      method="POST"
      action={action}
      readonly={false}
      bind:this={form}
      errorMessage={errorMessage}
      onsuccess={() => {
        if (dialog) {
          dialog.close();
          toastState.success("Item Updated!");
        }
      }}/>
</Modal>