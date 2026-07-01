<script lang="ts">
    type TableRow = {
        name: string;
        value: string;
    };

    interface PropertiesTableInputProps {
        value?: TableRow[];
        readonly?: boolean;
    }

    let { 
        value: tableRows = $bindable([]),
        readonly
    }: PropertiesTableInputProps = $props();

    const addRow = (name: string, value: string) => {
        tableRows.push({
            name,
            value
        });
    }

    export function clear() {
        tableRows = [];
    }

</script>

<div class="rounded-field border-neutral-content border p-2 overflow-x-hidden">
    <div class="overflow-x-auto">
        <fieldset class="fieldset">
            <legend class="fieldset-legend">Properties</legend>
            <table class="table table-xs table-zebra">
                <thead>
                    <tr>
                        <th>
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each tableRows as tableRow, i (i)}
                        <tr>
                            <td class="w-4">
                                {i + 1}.
                            </td>
                            {#if !readonly}
                                <td contenteditable="true" bind:innerText={tableRow.name}></td>
                                <td bind:innerText={tableRow.value} contenteditable="true" ></td>
                            {:else}
                                <td>{tableRow.name}</td>
                                <td>{tableRow.value}</td>
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </fieldset>
    </div>
    {#if !readonly}
        <button type="button" class="btn btn-sm btn-success w-full mt-4" onclick={() => addRow("", "")}>
        Add row
        </button>
    {/if}
</div>