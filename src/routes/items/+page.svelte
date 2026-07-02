<script lang="ts">
    import { invalidate } from '$app/navigation';
	import ItemList from '$lib/ui/items/ItemList.svelte';
	import CreateItemModal from '$lib/ui/items/CreateItemModal/CreateItemModal.svelte';
	import UpdateItemModal from '$lib/ui/items/UpdateItemModal/UpdateItemModal.svelte';

    let { data } = $props();

    let updateModal: UpdateItemModal;

    const handleDelete = async (itemId: number) => {
        if (!itemId) {
            return;
        }

        const formData = new FormData();
        formData.set('id', itemId.toString());

        const response = await fetch('?/delete', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            await invalidate("data:items");
        }
    };
</script>

<div class="w-full flex justify-center p-4">
    <CreateItemModal/>
</div>

<ItemList
    items={data.items}
    onEditClick={(itemData) => updateModal?.openModal(itemData)}
    onDeleteClick={handleDelete}
/>

<UpdateItemModal bind:this={updateModal}/>