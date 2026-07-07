<script lang="ts">
    import { enhance } from '$app/forms';

    interface Location {
        id: number;
        name: string;
    }

    let dialog: HTMLDialogElement;
    let locations: Location[] = $state([]);

    let itemData: number = $state(-1)

    export async function openModal(itemId: number) {
        itemData = itemId;

        const response = await fetch(`/items/locations?exclude_item=${itemId}`);
        locations = await response.json();

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
        action="?/addToLocation"
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
            <select name="locationId" class="select">
                {#each locations as location (location.id)}
                    <option value={location.id}>{location.name}</option>
                {/each}
            </select>
            <fieldset class="fieldset">
                <legend class="fieldset-legend">Quantity</legend>
                <input name="quantity" type="number" class="input" placeholder="Type here" defaultValue={1} />
            </fieldset>
            <button type="submit" class="btn btn-success mt-4 w-full">Save</button>
        </div>
    </form>
  </div>
</dialog>