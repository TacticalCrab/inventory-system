<script lang="ts">
	import { resolve } from '$app/paths';

    let { data } = $props();
</script>

<div class="p-4">
    <h1>Locations</h1>
    {#each data.locations as location (location.id)}
        <a href={resolve(`/locations/${location.id}`)}>
            <div class="border p-2 w-fit">
                <div>{location.name}</div>
                <div>{location.description}</div>
            </div>
        </a>
    {/each}
</div>