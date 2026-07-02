<script lang="ts">
    import { invalidate } from '$app/navigation';
    import ItemCard from './ItemCard/ItemCard.svelte';
    import CreateItemModal from './CreateItemModal/CreateItemModal.svelte';
    import UpdateItemModal from './UpdateItemModal/UpdateItemModal.svelte';

    let { data } = $props();

    let updateModal: UpdateItemModal;

    const handleDelete = async (itemData: { id?: number }) => {
        if (!itemData.id) {
            return;
        }

        const formData = new FormData();
        formData.set('id', itemData.id.toString());

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

<div class="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-4 p-4">
    {#each data.items as item (item.id)}
        <ItemCard
            id={item.id}
            name={item.name}
            description={item.description}
            properties={item.properties}
            categories={item.categories}
            createdAt={new Date(item.createdAt)}

            openProperties={true}

            onEditClick={(itemData) => updateModal?.openModal(itemData)}
            onDeleteClick={handleDelete}
            />
    {/each}
</div>

<UpdateItemModal bind:this={updateModal}/>