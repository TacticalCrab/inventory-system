<script lang="ts">
	import ItemList from '$lib/ui/items/ItemList.svelte';

      let { data } = $props();
</script>

<div class="flex flex-col items-center mt-4">
    <span class="badge badge-xl text-xl">
        {data.locationData?.name}
    </span>
    <div>{data.locationData?.description}</div>
</div>

<div class="mt-4">
    {#if data.items }
        <ItemList
            items={data.items}
        />
    {/if}
</div>