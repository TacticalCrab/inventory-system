<script lang="ts">
	import { invalidate } from '$app/navigation';
	import ItemList from '$lib/ui/items/ItemList.svelte';
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

<div class="flex flex-col items-center mt-4">
    <span class="badge badge-xl text-xl">
        {data.locationData?.name}
    </span>
    <div>{data.locationData?.description}</div>
</div>

<div class="mt-4">
    {#if data.items }
        <ItemList
            items={data.items}
            onEditClick={(itemData) => updateModal?.openModal(itemData)}
            onDeleteClick={(itemId) => handleDelete(itemId)}
        />
    {/if}
</div>

<UpdateItemModal bind:this={updateModal}/>