<script lang="ts">
	import type { Item } from '../../types/Item';
    import ItemCard from './ItemCard/ItemCard.svelte';

    export interface ItemWithOptions extends Item {
        disabled?: boolean;
    }

    interface Props {
        type?: "grid" | "column";

        items: ItemWithOptions[];

        openProperties?: boolean;
        openDescriptions?: boolean;
        enableLinks?: boolean;

        onAddClick?(itemId: Item["id"]): void;
        onEditClick?(itemData: Item): void;
        onDeleteClick?(itemId: Item["id"]): void;
        onRemoveClick?(itemId: Item["id"]): void;
        onLocationClick?(itemId: Item["id"]): void;
        onCopyClick?(itemId: Item["id"]): void;
    }

    let {
        type = "grid",
        items,
        openProperties = true,
        openDescriptions = true,
        enableLinks = true,
        onAddClick,
        onEditClick,
        onDeleteClick,
        onRemoveClick,
        onLocationClick,
        onCopyClick
    }: Props = $props();
</script>

<div class={[
    type === "grid" && "grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-4 p-4",
    type === "column" && "flex flex-col gap-4"

]}>
    {#each items as item (item.id)}
        <ItemCard
            {...item}

            openProperties={openProperties}
            openDescription={openDescriptions}
            enableLinks={enableLinks}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onRemoveClick={onRemoveClick}
            onLocationClick={onLocationClick}
            onCopyClick={onCopyClick}
        />
    {/each}
</div>

