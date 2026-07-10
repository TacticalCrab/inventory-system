<script lang="ts">
	import { SvelteURLSearchParams } from "svelte/reactivity";
	import BarcodeInput from "../barcode/BarcodeInput.svelte";
	import Modal from "../common/Modal.svelte";
	import AddToLocationModal from "../items/AddToLocationModal/AddToLocationModal.svelte";
	import ItemList, { type ItemWithOptions } from "../items/ItemList.svelte";

    let _locationId: number | null = $state(null);
    let barcodeValue = $state("");
    let items: ItemWithOptions[] = $state([]);

    let modal: Modal;
    let locationModal: AddToLocationModal;

    export const openModal = (locationId: number | null = null) => {
        barcodeValue = "";
        items = [];
        _locationId = locationId ?? null;
        modal.openModal();
    }

    const findItemsByBarcode = async (barcode: string) => {
        const queryParams = new SvelteURLSearchParams();
        queryParams.append("barcode", barcode);

        const response = await fetch(`/items?${queryParams.toString()}`);
        const items: ItemWithOptions[] = await response.json();

        if (!_locationId) {
            return items;
        }

        return items.map((i) => {
            if (i.locations?.find((l) => l.id === _locationId)) {
                i.disabled = true;
            }

            return i;
        });
    }

    $effect(() => {
        const currentBarcodeValue = barcodeValue;
        if (currentBarcodeValue.trim().length === 0) {
            if (items.length > 0) {
                items = [];
            }
            
            return;
        }

        findItemsByBarcode(currentBarcodeValue)
            .then((itemsResult) => {
                items = itemsResult
            })
            .catch(console.error)
    })

</script>

<Modal 
    bind:this={modal}
    style={{
        width: items.length > 0 ? 200 : 100
    }}
    >
    <div class="mt-2">
        <BarcodeInput bind:value={barcodeValue}/>
        <ItemList
            type="grid"
            openDescriptions={false}
            openProperties={false}
            enableLinks={false}
            items={items}
            onAddClick={(id) => {
                modal.close();
                locationModal.openModal(id, _locationId);
            }}/>
    </div>
</Modal>

<AddToLocationModal 
    bind:this={locationModal}/>