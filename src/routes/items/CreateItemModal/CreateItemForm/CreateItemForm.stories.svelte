<script module>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CreateItemForm from "./CreateItemForm.svelte";

    const { Story } = defineMeta({
        title: "CreateItemForm",
        tags: ["autodocs"]
    })
</script>


<Story name="Create item form">
    <div class="w-100 border p-4">
        <CreateItemForm/>
    </div>
</Story>
