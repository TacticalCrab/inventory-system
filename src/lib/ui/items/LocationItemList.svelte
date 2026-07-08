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
        onChangeValueClick?(itemId: {
            id: LocationItem["id"],
            quantity: LocationItem["quantity"],
            unit: LocationItem["unit"],
            name: string
        }): void;
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

</script>

<div class="grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-4 p-4">
    {#each items as item (item.id)}
        <ItemCard
            {...item}

            openProperties={true}

            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onRemoveClick={onRemoveClick}
            onLocationClick={onLocationClick}
            onCopyClick={onCopyClick}
            onChangeValueClick={(itemId) => onChangeValueClick?.({
                id: itemId,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit
            })}
        />
    {/each}
</div>

