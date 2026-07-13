<script lang="ts">
    import { goto, invalidate } from '$app/navigation';
	import ItemList from '$lib/ui/items/ItemList.svelte';
	import CreateItemModal from '$lib/ui/items/CreateItemModal/CreateItemModal.svelte';
	import UpdateItemModal from '$lib/ui/items/UpdateItemModal/UpdateItemModal.svelte';
	import InputSearch from '$lib/ui/common/InputSearch.svelte';
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import AddToLocationModal from '$lib/ui/items/AddToLocationModal/AddToLocationModal.svelte';

    let { data } = $props();

    let searchInput = $state("");

    function handleSearch() {
        const params = new SvelteURLSearchParams(page.url.searchParams);

        params.delete("q");
        if (searchInput) {
            searchInput.split(" ").filter(w => w.trim().length > 0).forEach((p) => params.append("q", p))
        }

        const targetUrl = `?${params.toString()}` as ResolvedPathname;
        goto(targetUrl, {
			keepFocus: true,
			noScroll: true,
			replaceState: true
		});
	}

    let updateModal: UpdateItemModal;
    let locationModal: AddToLocationModal;

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
            await invalidate("data:items");
        }
    };

    const handleCopy = async (itemId: number) => {
        if (!itemId) {
            return;
        }

        const response = await fetch(`/api/items/${itemId}/copy`, {
            method: "POST"
        });

        if (response.ok) {
            await invalidate("data:items");
        }
    }
</script>

<div class="p-4 flex gap-4 items-center">
    <InputSearch
        bind:value={searchInput}
        onSearchClick={() => handleSearch()}
    />
    <CreateItemModal/>
</div>

<ItemList
    items={data.items}
    onLocationClick={(itemId) => locationModal?.openModal(itemId)}
    onEditClick={(itemData) => updateModal?.openModal(itemData)}
    onDeleteClick={handleDelete}
    onCopyClick={handleCopy}
/>

<AddToLocationModal bind:this={locationModal} />
<UpdateItemModal bind:this={updateModal}/>