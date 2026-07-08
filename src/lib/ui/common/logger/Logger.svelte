<script lang="ts">
    let messages: string[] = $state([]);

    export const log = (message: string) => {
        messages.push(message);
    }
</script>

<div>
    {#each messages as message, index (index)}
        <div>
            {message}
        </div>
    {/each}
</div>