<script lang="ts">
    interface CategoryPickerProps {
        value?: string[];
        enableSearch?: boolean;
        debounceSeconds?: number;
        readonly?: boolean;

        onSearch?: (searchTerm: string) => Promise<string[]> | string[];
    }

    let { 
        value: selectedCategories = $bindable([]),
        enableSearch = true,
        debounceSeconds = 1000,
        readonly,

        onSearch
    }: CategoryPickerProps = $props();

    let searchValue = $state("");
    let searchResults: string[] = $state([]);

    let debounceTimeout: NodeJS.Timeout;
    const onkeydown = async (e: KeyboardEvent) => {
        if (e.key ==='Enter') {
            e.preventDefault();

            selectedCategories.push(searchValue);
            searchValue = "";
        } else {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            debounceTimeout = setTimeout(async () => {
                searchResults = await onSearch?.(searchValue) || [];
            }, debounceSeconds)
        };
    }

    const onCategoryAdd = (category: string) => {
        selectedCategories.push(category);
        searchValue = "";
        searchResults = [];
    }

    const onCategoryRemove = (category: string) => {
        const categoryIndex = selectedCategories.indexOf(category);
        if (categoryIndex === -1) return;

        selectedCategories.splice(categoryIndex, 1);
    }

    export function clear() {
        searchValue = "";
        selectedCategories = [];
        searchResults = [];
    }
</script>

<div class="rounded-field border-neutral-content border p-2">
    <input class="hidden" name="categories" value={selectedCategories.join(",")}>
    <fieldset class="fieldset">
        <legend class="fieldset-legend">Categories</legend>
        <div class="flex flex-wrap gap-1 p-2">
            {#each selectedCategories as category (category)}
                <div class="badge badge-primary">
                    {category}
                    {#if !readonly}
                        <button
                            onclick={() => onCategoryRemove(category)} 
                            type="button" 
                            class="btn-ghost cursor-pointer">✕</button>
                    {/if}
                </div>
            {/each}
        </div>
    </fieldset>
    {#if !readonly}
        <input
            onkeydown={onkeydown}
            bind:value={searchValue}
            type="text"
            placeholder="Search..."
            class="input input-sm w-full" 
        />
    {/if}
    {#if enableSearch && !readonly}
        <div class="flex flex-wrap gap-1 p-2">
            {#each searchResults as searchResult (searchResult)}
                <button
                    type="button"
                    onclick={() => onCategoryAdd(searchResult)}
                    class="badge bg-primary/70 hover:bg-primary text-primary-content cursor-pointer">{searchResult}
                </button>
            {/each}
        </div>
    {/if}
</div>