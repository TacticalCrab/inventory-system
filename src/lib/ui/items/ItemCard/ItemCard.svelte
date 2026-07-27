<script lang="ts">
	import { resolve } from "$app/paths";
	import { formatDate } from "$lib/common/date";
	import ChangeValueButton from "$lib/ui/common/buttons/ChangeValueButton.svelte";
	import CopyButton from "$lib/ui/common/buttons/CopyButton.svelte";
	import CreateButton from "$lib/ui/common/buttons/CreateButton.svelte";
	import DeleteButton from "$lib/ui/common/buttons/DeleteButton.svelte";
	import EditButton from "$lib/ui/common/buttons/EditButton.svelte";
	import LocationButton from "$lib/ui/common/buttons/LocationButton.svelte";
	import RemoveButton from "$lib/ui/common/buttons/RemoveButton.svelte";
	import Barcode from "$lib/ui/common/icons/Barcode.svelte";
	import type { Item } from "$lib/types/Item";
	import type { Snippet } from "svelte";

    interface Props extends Item {
        quantity?: number | null;
        unit?: string | null;

        children?: Snippet;

        disabled?: boolean;

        openDescription?: boolean;
        openProperties?: boolean;
        enableLinks?: boolean;

        onAddClick?(itemId: Item["id"]): void;
        onEditClick?(item: Item): void;
        onDeleteClick?(itemId: Item["id"]): void;
        onRemoveClick?(itemId: Item["id"]): void;
        onLocationClick?(itemId: Item["id"]): void;
        onCopyClick?(item: Item["id"]): void;
        onChangeValueClick?(itemId: Item["id"]): void;
    }

    const {
        children,

        id,
        name,
        barcode,
        description, 
        properties, 
        categories,
        createdAt,
        locations,

        quantity,
        unit,

        disabled = false,
        openDescription = true,
        openProperties = false,
        enableLinks = true,
        onAddClick,
        onEditClick,
        onRemoveClick,
        onDeleteClick,
        onLocationClick,
        onCopyClick,
        onChangeValueClick
    }: Props = $props();

    let formattedDate = $derived.by(() => {
        if (createdAt) {
            return formatDate(createdAt);
        }
        return undefined;
    });

    const _onAddClick = () => {
        onAddClick?.(id);
    }

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

    const _onChangeValueClick = () => {
        onChangeValueClick?.(id);
    }

</script>

<div class={[
    "card bg-base-200 w-full shadow-sm",
    disabled && "cursor-not-allowed"
]}>
    <div class="card-body">
        <div class="flex justify-between items-center flex-col md:flex-row">
            <div class="card-title flex-wrap items-center">
                <span>
                    {name}
                </span>

                {#if quantity}
                    <div class="badge badge-md badge-outline badge-info">
                        {quantity}{#if unit}&nbsp;{unit} {/if}
                    </div>
                {/if}
            </div>
            {#if !disabled}
                <div class="flex gap-2 mt-4 md:mt-0">
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
                    {#if onChangeValueClick}
                        <ChangeValueButton onclick={_onChangeValueClick}/>
                    {/if}
                    {#if onAddClick}
                        <CreateButton onclick={_onAddClick}/>
                    {/if}
                </div>
            {/if}
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
                        <a href={enableLinks ? resolve(`/locations/${location.id}`) : undefined} aria-label={location.name}>
                            {location.name}
                        </a>
                    </div>
                {/each}
            </div>
        {/if}
        {#if barcode}
            <div class="flex items-center mt-2">
                <Barcode/>&nbsp;{barcode}
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