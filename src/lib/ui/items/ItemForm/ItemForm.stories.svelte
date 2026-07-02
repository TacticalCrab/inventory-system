<script module>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ItemForm from "./ItemForm.svelte";

    const { Story } = defineMeta({
        title: "ItemForm",
        tags: ["autodocs"]
    })
</script>


<Story name="Create item form">
    <div class="w-100 border p-4">
        <ItemForm/>
    </div>
</Story>
