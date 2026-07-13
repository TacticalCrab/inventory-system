<script lang="ts">
    import { enhance } from '$app/forms';
	import { QUANITYT_UNITS } from '$lib/const';
	import Modal from '$lib/ui/common/Modal.svelte';

    interface Props {
        action: `?/${string}`;
    }

    const {
        action
    }: Props = $props();

    interface Location {
        id: number;
        name: string;
    }

    let forcedLocationId: number | null = $state(null);
    let dialog: Modal;
    let locations: Location[] = $state([]);

    let itemData: number = $state(-1)

    export async function openModal(itemId: number, locationId: number | null = null) {
        itemData = itemId;
        forcedLocationId = locationId || null;

        const response = await fetch(`/api/locations?exclude_item=${itemId}`);
        locations = await response.json();

        dialog.openModal();
    }

</script>

<Modal 
    bind:this={dialog}>
    <form
        action={action}
        method="POST"
        use:enhance={({formData}) => {
            formData.append("itemId", itemData.toString());

            return async ({result, update}) => {
                await update();

                if (result.type === 'success') {
                    dialog.close();
                }
            }
        }}
    >
        <div>
            <select name="locationId" class="select" disabled={forcedLocationId !== null || locations.length === 0}>
                {#each locations as location (location.id)}
                    <option 
                        selected={forcedLocationId === location.id} 
                        value={location.id}>
                            {location.name}
                    </option>
                {/each}
                {#if locations.length === 0}
                    <option selected>
                        Every location available is assigned
                    </option>
                {/if}
            </select>
            {#if forcedLocationId !== null}
                <input class="hidden" name="locationId" value={forcedLocationId}/>
            {/if}
            <fieldset class="fieldset">
                <legend class="fieldset-legend">Quantity</legend>
                <div class="flex">
                    <input class="input w-30" name="quantity" type="number" placeholder="Type here" defaultValue={1} />
                    <select class="select w-20" name="unit">
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
            <button disabled={locations.length === 0} type="submit" class="btn btn-success mt-4 w-full">Save</button>
        </div>
    </form>
</Modal>