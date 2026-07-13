<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import type { ResolvedPathname } from '$app/types';
	import InputSearch from '$lib/ui/common/InputSearch.svelte';
	import LocationItemList from '$lib/ui/items/LocationItemList.svelte';
	import UpdateItemModal from '$lib/ui/items/UpdateItemModal/UpdateItemModal.svelte';
	import UpdateQuantityModal from '$lib/ui/items/UpdateQuantityModal/UpdateQuantityModal.svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
    import { page } from "$app/state";
	import BarcodeAdd from '$lib/ui/common/buttons/BarcodeAdd.svelte';
	import AddItemToLocationByBarcodeModal from '$lib/ui/locations/AddItemToLocationByBarcodeModal.svelte';

    let { data } = $props();

    let updateModal: UpdateItemModal;
    let updateQuantityModal: UpdateQuantityModal;
    let barcodeModal: AddItemToLocationByBarcodeModal;

    const handleDelete = async (itemId: number) => {
        if (!itemId) {
            return;
        }

        const data = JSON.stringify({
            id: itemId
        });

        const response = await fetch('/api/items', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: data,
        });

        if (response.ok) {
            await invalidate("location:data:items");
        }
    };

    const handleRemoveItemFromLocation = async (itemId: number, locationId: number | null = null) => {
        if (!itemId || !locationId) {
            return;
        }

        const response = await fetch(`/api/locations/${locationId}/items/${itemId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            await invalidate("location:data:items");
        }
    }

    const handleSearch = () => {
        const params = new SvelteURLSearchParams(page.url.searchParams);

        params.delete("q");
        if (searchInput) {
            searchInput.split(" ").filter(w => w.trim().length > 0).forEach((p) => params.append("q", p));
        }

        const targetUrl = `?${params.toString()}` as ResolvedPathname;
        goto(targetUrl, {
            keepFocus: true,
            noScroll: true,
            replaceState: true
        });
    }

    let searchInput = $state("");
</script>

<div class="flex flex-col items-center mt-2">
    <span class="badge badge-xl text-xl">
        {data.locationData?.name}
    </span>
    <div>{data.locationData?.description}</div>
</div>

<div class="p-4 flex gap-4 items-center">
    <InputSearch
        bind:value={searchInput}
        onSearchClick={() => handleSearch()}
    />

    <BarcodeAdd onclick={() => barcodeModal.openModal(data.locationData?.id)}/>
</div>

<div class="mt-4">
    {#if data.items }
        <LocationItemList
            items={data.items}
            onRemoveClick={(itemId) => handleRemoveItemFromLocation(itemId, data.locationData.id)}
            onEditClick={(itemData) => updateModal?.openModal(itemData)}
            onDeleteClick={(itemId) => handleDelete(itemId)}
            onChangeValueClick={(itemData) => updateQuantityModal?.openModal(data.locationData.id, itemData)}
        />
    {/if}
</div>

<UpdateItemModal bind:this={updateModal}/>
<UpdateQuantityModal bind:this={updateQuantityModal}/>
<AddItemToLocationByBarcodeModal bind:this={barcodeModal}/>