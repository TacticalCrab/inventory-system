<script module>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CategoryPicker from "./CategoryPicker.svelte";

    const { Story } = defineMeta({
        title: "CategoryPicker",
        component: CategoryPicker,
        tags: ["autodoc"]
    })
</script>

<Story name="Default"/>