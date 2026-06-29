<script lang="ts">
    import { enhance } from '$app/forms';
    import CategoryPicker from "./CategoryPicker/CategoryPicker.svelte";

    interface CreateItemFormProps {
        onsubmit?(): void
    }

    const { onsubmit }: CreateItemFormProps = $props();

    let categoryPicker: CategoryPicker;

    let name = $state("");
    let description = $state("");

    export function clear() {
        name = "";
        description = "";
        categoryPicker.clear();
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
    method="POST" 
    action="?/create" 
    onsubmit={onsubmit} 
    use:enhance>

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
    <CategoryPicker 
        bind:this={categoryPicker}
        debounceSeconds={500}
        onSearch={onSearch}/>
    <button type="submit" class="btn btn-success mt-4">Save</button>
</form>