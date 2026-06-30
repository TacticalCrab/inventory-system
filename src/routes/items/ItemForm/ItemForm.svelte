<script lang="ts">
    import { enhance } from '$app/forms';
	import type { HTMLFormAttributes } from 'svelte/elements';
    import CategoryPicker from "./CategoryPicker/CategoryPicker.svelte";
    import PropertiesTableInput from './PropertiesTableInput/PropertiesTableInput.svelte';
	import type { Property } from '../ItemCard/ItemCard.svelte';

    interface ItemFormProps {
        method?: HTMLFormAttributes["method"];
        action?: string;
        readonly?: boolean;

        onsubmit?(): void;
    }

    const { method, action, readonly, onsubmit }: ItemFormProps = $props();

    let categoryPicker: CategoryPicker;
    let propertiesTableInput: PropertiesTableInput;

    let name = $state("");
    let description = $state("");
    let categories: string[] = $state([]);
    let properties: Property[] = $state([]);

    const onSearch = async (searchTerm: string) => {
        if (searchTerm.length < 2) return [];
        
        const response = await fetch(`/items/categories?search=${searchTerm}`)
        const categories: string[] = await response.json();

        return categories
            .filter((v) => v.toLocaleLowerCase()
                            .startsWith(searchTerm.toLocaleLowerCase()
                        ));
    }

    export function clear() {
        name = "";
        description = "";
        categoryPicker.clear();
        propertiesTableInput.clear();
    }

    interface FormData {
        name?: string | null;
        description?: string | null;
        categories?: string[] | null;
        properties?: Property[] | null;
    }

    export function setData(data: FormData) {
        name = data.name || "";
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
        formData.append('properties', JSON.stringify(properties));
    }}>

    <h2>Create Item</h2>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Item name</legend>
        <input bind:value={name} {readonly} name="name" type="text" class="input" placeholder="name" required/>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Item Description</legend>
        <textarea bind:value={description} {readonly} name="description" class="textarea h-20 w-full" placeholder="Description"></textarea>
        <div class="label">Optional</div>
    </fieldset>

    <div class="mt-2">
        <PropertiesTableInput
            bind:this={propertiesTableInput}
            bind:value={properties}
            {readonly}/>
    </div>

    <div class="mt-2">
        <CategoryPicker
            bind:this={categoryPicker}
            bind:value={categories}
            {readonly}
            debounceSeconds={500}
            onSearch={onSearch}/>
    </div>

    {#if !readonly}
        <button type="submit" class="btn btn-success mt-4 w-full">Save</button>
    {/if}
</form>