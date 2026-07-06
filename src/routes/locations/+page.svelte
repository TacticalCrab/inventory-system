<script lang="ts">
	import { resolve } from '$app/paths';
	import LocationCard from '$lib/ui/locations/LocationCard.svelte';

    let { data } = $props();
</script>

<div class="p-4">
    <div class="grid sm:grid-cols-3 md:grid-cols-4 justify-items-center gap-4 p-4">
        {#each data.locations as location (location.id)}
            <a class="w-full" href={resolve(`/locations/${location.id}`)}>
                <LocationCard
                    id={location.id}
                    name={location.name}
                    description={location.description}
                    itemsCount={location.itemCount}
                />
            </a>
        {/each}
    </div>
</div>