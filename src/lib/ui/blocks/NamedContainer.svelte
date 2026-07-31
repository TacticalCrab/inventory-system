<script lang="ts">
	import type { Snippet } from "svelte";

    interface Props {
        title: string;
        children?: Snippet;
    }

    const {
        title,
        children
    }: Props = $props();

</script>

<div class="rounded border-base-300 bg-base-200 w-full p-2">
    <div>
        {title}
    </div>
    <div>
        {#if children}
            {@render children()}
        {/if}
    </div>
</div>