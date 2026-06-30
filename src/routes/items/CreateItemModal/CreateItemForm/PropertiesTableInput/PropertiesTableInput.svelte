<script lang="ts">
    type TableRow = {
        name: string;
        value: string;
    };

    interface PropertiesTableInputProps {
        value?: TableRow[];
    }

    let { value: tableRows = $bindable([]) }: PropertiesTableInputProps = $props();

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

<div class="overflow-x-auto rounded-field border-neutral-content border p-2">
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
                <td>
                    {i + 1}.
                </td>
                <td bind:innerText={tableRow.name} contenteditable="true">
                    {tableRow.name}
                </td>
                <td bind:innerText={tableRow.value} contenteditable="true" >
                    {tableRow.value}
                </td>
            </tr>
        {/each}
    </tbody>
  </table>

  <button type="button" class="btn btn-sm btn-success w-full mt-4" onclick={() => addRow("", "")}>
    Add row
  </button>
</div>