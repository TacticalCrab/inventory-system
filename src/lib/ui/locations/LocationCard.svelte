<script lang="ts">

    interface Props {
        id: number;
        name: string;
        description?: string | null;
        itemsCount?: number;
    }

    const {
        id,
        name,
        description,
        itemsCount
    }: Props = $props();
</script>

<div class="card bg-base-200 w-full shadow-sm">
    <div class="card-body">
        <div class="card-title">{name} #{id}</div>
        {#if description}
            <div class="text-md">
                {description}
            </div>
        {/if}
        {#if itemsCount !== null}
            <div class="text-md">
                Items: {itemsCount}
            </div>
        {/if}
    </div>
</div>
