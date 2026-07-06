<script lang="ts">
	import type { Item } from '../types/Item';
    import ItemCard from './ItemCard/ItemCard.svelte';

    interface Props {
        items: Item[];
        onEditClick?(itemData: Item): void;
        onDeleteClick?(itemId: Item["id"]): void;
        onRemoveClick?(itemId: Item["id"]): void;
        onLocationClick?(itemId: Item["id"]): void;
        onCopyClick?(itemId: Item["id"]): void;
    }

    let { 
        items,
        onEditClick,
        onDeleteClick,
        onRemoveClick,
        onLocationClick,
        onCopyClick
    }: Props = $props();
</script>

<div class="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-4 p-4">
    {#each items as item (item.id)}
        <ItemCard
            id={item.id}
            name={item.name}
            description={item.description}
            properties={item.properties}
            categories={item.categories}
            createdAt={item.createdAt}
            locations={item.locations}

            openProperties={true}

            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onRemoveClick={onRemoveClick}
            onLocationClick={onLocationClick}
            onCopyClick={onCopyClick}
        />
    {/each}
</div>

