<script lang="ts">
    import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { QUANITYT_UNITS } from '$lib/const';
    let dialog: HTMLDialogElement;

    interface ItemData {
        id: number;
        name?: string | null;
        quantity?: number | null;
        unit?: string | null;
    }

    let item: ItemData = $state({
        id: -1,
        name: null,
        quantity: 0,
        unit: ""
    });

    let _locationId: number | null = $state(null);

    export async function openModal(locationId: number, itemData: ItemData) {
        item = {
            id: itemData.id,
            name: itemData.name || null,
            quantity: itemData.quantity || 0,
            unit: itemData.unit || ""
        }

        _locationId = locationId;

        dialog.showModal();
    }

</script>

<dialog
  bind:this={dialog} 
  class="modal">
  <div class="modal-box w-100">
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" >
        ✕
      </button>
    </form>

    <form
        action="?/updateItemQuantity"
        method="POST"
        use:enhance={({formData}) => {
            if (_locationId === null) {
                return;
            }

            formData.append("itemId", item.id.toString());
            formData.append("locationId", _locationId.toString())

            return async ({result, update}) => {
                await update();

                if (result.type === 'success') {
                    dialog.close();

                    await invalidate("location:data:items");
                }
            }
        }}
    >
        <div>
            {#if item.name}
                <h2>{item.name}</h2>
            {/if}
            <fieldset class="fieldset">
                <legend class="fieldset-legend">Quantity</legend>
                <div class="flex">
                    <input 
                        bind:value={item.quantity}
                        class="input w-30"
                        name="quantity"
                        type="number"
                        placeholder="Type here"
                        defaultValue={1} 
                    />
                    <select 
                        bind:value={item.unit}
                        class="select w-20" 
                        name="unit">
                        
                        {#each QUANITYT_UNITS as unit, i (i)}
                            {#if unit === ""}
                                <option selected value="">None</option>
                            {:else}
                                <option value={unit}>{unit}</option>
                            {/if}
                        {/each}
                    </select>
                </div>
            </fieldset>
            <button type="submit" class="btn btn-success mt-4 w-full">Save</button>
        </div>
    </form>
  </div>
</dialog>