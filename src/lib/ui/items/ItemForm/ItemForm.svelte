<script lang="ts">
    import { enhance } from '$app/forms';
	import type { HTMLFormAttributes } from 'svelte/elements';
    import CategoryPicker from "./CategoryPicker/CategoryPicker.svelte";
    import PropertiesTableInput from './PropertiesTableInput/PropertiesTableInput.svelte';
	import type { Property } from '../ItemCard/ItemCard.svelte';
	import BarcodeInput from '$lib/ui/barcode/BarcodeInput.svelte';

    interface ItemFormProps {
        title?: string;
        method?: HTMLFormAttributes["method"];
        action?: string;
        readonly?: boolean;
        errorMessage?: string | null;

        onsubmit?(): void;
        onsuccess?(): void;
    }

    const {
        title, 
        method,
        action,
        readonly,
        errorMessage,

        onsubmit,
        onsuccess
    }: ItemFormProps = $props();

    let categoryPicker: CategoryPicker;
    let propertiesTableInput: PropertiesTableInput;

    let id: number | null = $state(null);
    let name = $state("");
    let description = $state("");
    let categories: string[] = $state([]);
    let properties: Property[] = $state([]);
    let barcode: string = $state('');

    const onSearch = async (searchTerm: string) => {
        if (searchTerm.length < 2) return [];
        
        const response = await fetch(`/api/categories?search=${searchTerm}`)
        const categories: string[] = await response.json();

        return categories
            .filter((v) => v.toLocaleLowerCase()
                            .startsWith(searchTerm.toLocaleLowerCase()
                        ));
    }

    export function clear() {
        name = "";
        description = "";
        barcode = "";
        categoryPicker.clear();
        propertiesTableInput.clear();
    }

    interface FormData {
        id?: number | null;
        name?: string | null;
        barcode?: string | null;
        description?: string | null;
        categories?: string[] | null;
        properties?: Property[] | null;
    }

    export function setData(data: FormData) {
        id = data.id || null;
        name = data.name || "";
        barcode = data.barcode || "";
        description = data.description || "";
        categories = data.categories || [];
        properties = data.properties || [];
    }

</script>

<form
    method={method}
    action={action} 
    onsubmit={onsubmit}
    use:enhance={({ formData }) => {
        if (id) formData.append('id', id.toString());
        formData.append('properties', JSON.stringify(properties));

        return async ({result, update}) => {
            await update();

            if (result.type === 'success') {
                onsuccess?.();
            }
        }
    }}>

    {#if title}
        <h2>{title} #{id}</h2>
    {/if}

    {#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{/if}

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Item name</legend>
        <input bind:value={name} {readonly} name="name" type="text" class="input" placeholder="name" required/>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Item Description</legend>
        <textarea bind:value={description} {readonly} name="description" class="textarea h-20 w-full" placeholder="Description"></textarea>
        <div class="label">Optional</div>
    </fieldset>

    <div class="mt-4">
        <PropertiesTableInput
            bind:this={propertiesTableInput}
            bind:value={properties}
            {readonly}/>
    </div>

    <div class="mt-4">
        <CategoryPicker
            bind:this={categoryPicker}
            bind:value={categories}
            {readonly}
            debounceSeconds={500}
            onSearch={onSearch}/>
    </div>
    <div class="mt-4">
        <BarcodeInput 
            bind:value={barcode}
            name="barcode"/>
    </div>

    {#if !readonly}
        <button type="submit" class="btn btn-success mt-4 w-full">Save</button>
    {/if}
</form>

<style>
	.error-message {
		color: #ff3e00;
		font-weight: bold;
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}
</style>