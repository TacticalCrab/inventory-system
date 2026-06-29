<script>
    import ItemCard from './ItemCard/ItemCard.svelte';
    import CreateItemModal from './CreateItemModal/CreateItemModal.svelte';

    let { data } = $props();
</script>

<div class="w-full flex justify-center p-4">
    <CreateItemModal/>
</div>

<div class="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-4 p-4">
    {#each data.items as item (item.id)}
        <ItemCard 
            name={item.name}
            description={item.description}
            properties={item.properties}
            categories={item.categories}
            createdAt={new Date(item.createdAt)}

            openProperties={true}/>
    {/each}
</div>