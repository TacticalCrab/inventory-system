<script lang="ts">
	import type { Item, LocationItem } from '../types/Item';
    import ItemCard from './ItemCard/ItemCard.svelte';

    interface Props {
        items: LocationItem[];
        onEditClick?(itemData: Item): void;
        onDeleteClick?(itemId: Item["id"]): void;
        onRemoveClick?(itemId: Item["id"]): void;
        onLocationClick?(itemId: Item["id"]): void;
        onCopyClick?(itemId: Item["id"]): void;
        onChangeValueClick?(itemId: Item["id"]): void;
    }

    let { 
        items,
        onEditClick,
        onDeleteClick,
        onRemoveClick,
        onLocationClick,
        onCopyClick,
        onChangeValueClick
    }: Props = $props();

    const itemsUpdated = $derived.by(() => items.map((item) => {
        let name = item.name;
        if (item.quantity) {
            if (item.unit) {
                name += ` ( ${item.quantity}${item.unit} )`
            } else {
                name += ` ( x${item.quantity} )`
            }
        }

        return {
            ...item,
            name
        }
    }))

</script>

<div class="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-4 p-4">
    {#each itemsUpdated as item (item.id)}
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
            onChangeValueClick={onChangeValueClick}
        />
    {/each}
</div>

