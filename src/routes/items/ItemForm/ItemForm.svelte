<script lang="ts">
    import { enhance } from '$app/forms';
	import type { HTMLFormAttributes } from 'svelte/elements';
    import CategoryPicker from "./CategoryPicker/CategoryPicker.svelte";
    import PropertiesTableInput from './PropertiesTableInput/PropertiesTableInput.svelte';

    interface ItemFormProps {
        method?: HTMLFormAttributes["method"];
        action?: string;

        onsubmit?(): void;
    }

    const { method, action, onsubmit }: ItemFormProps = $props();

    let categoryPicker: CategoryPicker;
    let propertiesTableInput: PropertiesTableInput;

    let name = $state("");
    let description = $state("");
    let categories = $state([]);
    let properties = $state([]);

    export function clear() {
        name = "";
        description = "";
        categoryPicker.clear();
        propertiesTableInput.clear();
    }

    const onSearch = async (searchTerm: string) => {
        if (searchTerm.length < 2) return [];
        
        const response = await fetch(`/items/categories?search=${searchTerm}`)
        const categories: string[] = await response.json();

        return categories
            .filter((v) => v.toLocaleLowerCase()
                            .startsWith(searchTerm.toLocaleLowerCase()
                        ));
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
        <input bind:value={name} name="name" type="text" class="input" placeholder="name" required/>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Item Description</legend>
        <textarea bind:value={description} name="description" class="textarea h-20 w-full" placeholder="Description"></textarea>
        <div class="label">Optional</div>
    </fieldset>

    <div class="mt-2">
        <PropertiesTableInput 
            bind:this={propertiesTableInput}
            bind:value={properties}/>
    </div>

    <div class="mt-2">
        <CategoryPicker
            bind:this={categoryPicker}
            bind:value={categories}
            debounceSeconds={500}
            onSearch={onSearch}/>
    </div>

    <button type="submit" class="btn btn-success mt-4 w-full">Save</button>
</form>