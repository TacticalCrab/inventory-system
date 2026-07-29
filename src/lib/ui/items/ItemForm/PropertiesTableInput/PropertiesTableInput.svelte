<script lang="ts">
	import { isDate } from "$lib/common/date";
	import { isNumber } from "$lib/common/number";
	import { getSpecialPropertyType, isSpecialProperty, SpecialPRoperties } from "$lib/common/specialProperties";
	import { PropertyTypeName } from "$lib/types/Item";
	import DeleteButton from "$lib/ui/common/buttons/DeleteButton.svelte";
	import ExpireDateButton from "$lib/ui/common/buttons/ExpireDateButton.svelte";
	import Calendar from "$lib/ui/common/Calendar.svelte";
	import { SvelteSet } from "svelte/reactivity";

    type TableRow = {
        id?: number;
        name: string;
        value: string;
        typeName: PropertyTypeName;
    };

    interface PropertiesTableInputProps {
        value?: TableRow[];
        readonly?: boolean;
    }

    let { 
        value: tableRows = $bindable([]),
        readonly
    }: PropertiesTableInputProps = $props();

    const specialRows = new SvelteSet();

    const addRow = (name: string, value: string) => {
        if (isSpecialProperty(name)) {
            const tableRow = {
                id: undefined,
                name,
                value,
                typeName: getSpecialPropertyType(name) || PropertyTypeName.STR
            } as TableRow;

            tableRows.push(tableRow);
            specialRows.add(tableRow);
        } else {
            tableRows.push({
                id: undefined,
                name,
                value,
                typeName: PropertyTypeName.STR
            });
        }
    }

    const removeRow = (rowIndex: number) => {
        tableRows.splice(rowIndex, 1);
    }

    function handleTypeChange(tableRow: TableRow) {
        if (tableRow.typeName === PropertyTypeName.NUMBER && !isNumber(tableRow.value)) {
            tableRow.value = ""
        }

        else if (tableRow.typeName === PropertyTypeName.DATE && !isDate(tableRow.value)) {
            tableRow.value = "";
        }
    }

      function validateValueRow(value: string, type: PropertyTypeName): boolean {
        switch (type) {
            case PropertyTypeName.NUMBER:
                return isNumber(value);

            case PropertyTypeName.DATE:
                return isDate(value);
        }

        return true;
    }

    function handleBeforeInput(
        event: InputEvent,
        tableRow: TableRow
    ) {
        if (event.inputType.startsWith("delete")) {
            return;
        }

        const element = event.currentTarget as HTMLTableCellElement;
        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const currentValue = element.innerText;
        const range = selection.getRangeAt(0);

        const start = range.startOffset;
        const end = range.endOffset;
        const insertedText = event.data ?? "";

        const nextValue =
            currentValue.slice(0, start) +
            insertedText +
            currentValue.slice(end);

        if (!validateValueRow(nextValue, tableRow.typeName)) {
            event.preventDefault();
        }
    }

    function handlePropertyInput(tableRow: TableRow) {
        const isSpecial = isSpecialProperty(tableRow.name);

        if (specialRows.has(tableRow) && !isSpecial) {
            specialRows.delete(tableRow)
        }

        else if (isSpecial) {
            tableRow.typeName = PropertyTypeName.DATE;
            specialRows.add(tableRow);
        }
    }

    export function clear() {
        tableRows = [];
    }

    $effect(() => {
        for (const tableRow of tableRows) {
            if (isSpecialProperty(tableRow.name)) {
                specialRows.add(tableRow);
            }
        }
    })

    const tdStyle = "w-50 max-w-50";
</script>

<div class="rounded-field border-neutral-content border p-2 overflow-x-hidden">
    <div class="overflow-x-auto">
        <fieldset class="fieldset min-w-0">
            <legend class="fieldset-legend">Properties</legend>
            <table class="table table-xs sm:table-fixed table-zebra">
                <thead>
                    <tr>
                        <th class="w-20">
                            Order
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Value
                        </th>
                        <th class="w-20">
                            Type
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each tableRows as tableRow, i (i)}
                        <tr>
                            <td class="w-20 flex items-center gap-4">
                                {#if !readonly}
                                    <DeleteButton onclick={() => removeRow(i)}/>
                                {/if}
                                {i + 1}.
                            </td>
                            {#if !readonly}
                                <td
                                    class={[
                                        "align-top",
                                        tdStyle
                                    ]}
                                    contenteditable="true" 
                                    bind:innerText={tableRow.name}
                                    oninput={() => handlePropertyInput(tableRow)}></td>

                                {#if tableRow.typeName !== PropertyTypeName.DATE}
                                    <td
                                        class={[
                                            "align-top",
                                            tdStyle
                                        ]}
                                        contenteditable="true"
                                        bind:innerText={tableRow.value}
                                        onbeforeinput={(event) => handleBeforeInput(event, tableRow)}
                                        ></td>
                                {:else}
                                    <td class="align-top">
                                        <Calendar bind:value={tableRow.value}/>
                                    </td>
                                {/if}
                            {:else}
                                <td>{tableRow.name}</td>
                                <td>{tableRow.value}</td>
                            {/if}
                            <td class="w-20">
                                <select
                                        disabled={specialRows.has(tableRow)}
                                        class="select select-xs text-xs" 
                                        bind:value={tableRow.typeName}
                                        onchange={() => handleTypeChange(tableRow)}
                                    >
                                    <option value={PropertyTypeName.STR}>
                                        {PropertyTypeName.STR}
                                    </option>
                                    <option value={PropertyTypeName.NUMBER}>
                                        {PropertyTypeName.NUMBER}
                                    </option>
                                    <option value={PropertyTypeName.DATE}>
                                        {PropertyTypeName.DATE}
                                    </option>
                                </select>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </fieldset>
    </div>
    {#if !readonly}
        <div class="flex justify-center">
            <ExpireDateButton onclick={() => addRow(SpecialPRoperties.EXPIRE_DATE, "")}/>
        </div>
        <button type="button" class="btn btn-sm btn-success w-full mt-2" onclick={() => addRow("", "")}>
            Add row
        </button>
    {/if}
</div>