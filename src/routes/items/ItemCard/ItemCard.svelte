<script lang="ts">
	import DeleteButton from "$lib/ui/common/DeleteButton.svelte";
	import EditButton from "$lib/ui/common/EditButton.svelte";

    export interface Property {
        id?: number;
        name: string;
        value: string;
    }

    export interface ItemData {
        id?: number;
        name: string;
        description?: string | null;
        properties?: Property[] | null,
        categories?: string[] | null;
        createdAt?: Date;
    }

    interface Props extends ItemData {
        openDescription?: boolean;
        openProperties?: boolean;

        onEditClick?(item: ItemData): void;
        onDeleteClick?(item: ItemData): void;
    }

    const {
        id,
        name, 
        description, 
        properties, 
        categories,
        createdAt,

        openDescription = true,
        openProperties = false,
        onEditClick,
        onDeleteClick
    }: Props = $props();

    let formattedDate = $derived.by(() => {
        if (createdAt) {
            const day = String(createdAt.getDate()).padStart(2, '0');
            const month = String(createdAt.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed!
            const year = createdAt.getFullYear();

            const hours = String(createdAt.getHours()).padStart(2, '0');
            const minutes = String(createdAt.getMinutes()).padStart(2, '0');

            return `${day}.${month}.${year} ${hours}:${minutes}`;
        }
        return undefined;
    });

    const _onEditClick = () => {
        onEditClick?.({
            id,
            name,
            description,
            categories,
            properties,
            createdAt,
        });
    }

    const _onDeleteClick = () => {
        onDeleteClick?.({
            id,
            name,
            description,
            categories,
            properties,
            createdAt
        });
    }
    
</script>

<div class="card bg-base-200 w-full shadow-sm">
    <div class="card-body">
        <div class="flex justify-between">
            <div class="card-title">{name}</div>
            <div class="flex gap-2">
                {#if onEditClick}
                    <EditButton onclick={_onEditClick} />
                {/if}
                {#if onDeleteClick}
                    <DeleteButton onclick={_onDeleteClick} />
                {/if}
            </div>
        </div>
        {#if categories && categories.length > 0}
            <div class="flex gap-1 flex-wrap">
                {#each categories as category (category)}
                    <div class="badge badge-soft badge-primary badge-sm">{category}</div>
                {/each}
            </div>
        {/if}
        {#if description && description.length > 0}
            <details class="collapse collapse-arrow bg-base-100 border border-base-300" open={openDescription}>
                <summary class="collapse-title font-semibold">Description</summary>
                <div class="collapse-content">
                    {description}
                </div>
            </details>
        {/if}
        {#if properties && properties.length > 0}
            <details class="collapse collapse-arrow bg-base-100 border border-base-300" open={openProperties}>
                <summary class="collapse-title font-semibold">Properties</summary>
                <div class="collapse-content overflow-x-auto">
                    <table class="table table-xs">
                        <tbody>
                            {#each properties as prop (prop.id)}
                                <tr>
                                    <td>{prop.name}</td>
                                    <td>{prop.value}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </details>
        {/if}
        {#if createdAt}
            <div class="text-xs mt-1">
                {formattedDate}
            </div>
        {/if}
    </div>
</div>