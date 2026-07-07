<script lang="ts">
	import { resolve } from "$app/paths";
	import CopyButton from "$lib/ui/common/buttons/CopyButton.svelte";
	import DeleteButton from "$lib/ui/common/buttons/DeleteButton.svelte";
	import EditButton from "$lib/ui/common/buttons/EditButton.svelte";
	import LocationButton from "$lib/ui/common/buttons/LocationButton.svelte";
	import RemoveButton from "$lib/ui/common/buttons/RemoveButton.svelte";
	import type { Item } from "$lib/ui/types/Item";
	import type { Snippet } from "svelte";

    export interface Property {
        id?: number;
        name: string;
        value: string;
    }

    interface Props extends Item {
        children?: Snippet;

        openDescription?: boolean;
        openProperties?: boolean;

        onEditClick?(item: Item): void;
        onDeleteClick?(itemId: Item["id"]): void;
        onRemoveClick?(itemId: Item["id"]): void;
        onLocationClick?(itemId: Item["id"]): void;
        onCopyClick?(item: Item["id"]): void;
    }

    const {
        children,

        id,
        name, 
        description, 
        properties, 
        categories,
        createdAt,
        locations,

        openDescription = true,
        openProperties = false,
        onEditClick,
        onRemoveClick,
        onDeleteClick,
        onLocationClick,
        onCopyClick
    }: Props = $props();

    let formattedDate = $derived.by(() => {
        if (createdAt) {
            const createdAtDate = new Date(createdAt);
            const day = String(createdAtDate.getDate()).padStart(2, '0');
            const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed!
            const year = createdAtDate.getFullYear();

            const hours = String(createdAtDate.getHours()).padStart(2, '0');
            const minutes = String(createdAtDate.getMinutes()).padStart(2, '0');

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
        } as Item);
    }

    const _onLocationClick = () => {
        onLocationClick?.(id);
    }

    const _onRemoveClick = () => {
        onRemoveClick?.(id);
    }

    const _onDeleteClick = () => {
        onDeleteClick?.(id);
    }

    const _onCopyClick = () => {
        onCopyClick?.(id);
    }
    
</script>

<div class="card bg-base-200 w-full shadow-sm">
    <div class="card-body">
        <div class="flex justify-between">
            <div class="card-title">{name}</div>
            <div class="flex gap-2">
                {#if onDeleteClick}
                    <DeleteButton onclick={_onDeleteClick} />
                {/if}
                {#if onRemoveClick}
                    <RemoveButton onclick={_onRemoveClick}/>
                {/if}
                {#if onEditClick}
                    <EditButton onclick={_onEditClick} />
                {/if}
                {#if onCopyClick}
                    <CopyButton onclick={_onCopyClick}/>
                {/if}
                {#if onLocationClick}
                    <LocationButton onclick={_onLocationClick}/>
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
                    <table class="table table-xs table-fixed whitespace-normal wrap-break-word [word-break:break-word]">
                        <tbody>
                            {#each properties as prop (prop.id)}
                                <tr>
                                    <td class="align-top">
                                        {prop.name}
                                    </td>
                                    <td class="align-top">
                                        {prop.value}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </details>
        {/if}
        {#if locations && locations.length > 0}
            <div class="flex gap-2">
                {#each locations as location (location.id)}
                    <div class="badge badge-secondary badge-sm">
                        <a href={resolve(`/locations/${location.id}`)} aria-label={location.name}>
                            {location.name}
                        </a>
                    </div>
                {/each}
            </div>
        {/if}
        {#if children}
            {@render children()}
        {/if}
        {#if createdAt}
            <div class="text-xs mt-1">
                {formattedDate}
            </div>
        {/if}
    </div>
</div>