<script module>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ItemCard from "./ItemCard.svelte";

    const { Story } = defineMeta({
        title: "ItemCard",
        component: ItemCard,
        tags: ["autodocs"]
    })

</script>

<Story name="All Properties" args={{
    name: "Makłowicz - ryż bismati w sosie teryiaki",
    description: "Obiad dla jednej osoby od makłowicza ryż bistami w sobrym sosie teryiaki",
    properties: [
        { name: "Kalorie", value: "500 kcali" },
        { name: "Data ważności", value: "24.06.2026" },
        { name: "Białko", value: "10g" }
    ],
    categories: ["Obiad", "Dobre", "Białkowe"],
    createdAt: new Date()
}}/>

<Story name="Only categories" args={{
    name: "Makłowicz - ryż bismati w sosie teryiaki",
    categories: ["Obiad", "Dobre", "Białkowe"]
}}/>

<Story name="Without description" args={{
    name: "Makłowicz - ryż bismati w sosie teryiaki",
    properties: [
        { name: "Kalorie", value: "500 kcali" },
        { name: "Data ważności", value: "24.06.2026" },
        { name: "Białko", value: "10g" }
    ],
    categories: ["Obiad", "Dobre", "Białkowe"]
}}/>

<Story name="Without Properties" args={{
    name: "Makłowicz - ryż bismati w sosie teryiaki",
    description: "Obiad dla jednej osoby od makłowicza ryż bistami w sobrym sosie teryiaki",
    categories: ["Obiad", "Dobre", "Białkowe"]
}}/>

<Story name="Without categories" args={{
    name: "Makłowicz - ryż bismati w sosie teryiaki",
    description: "Obiad dla jednej osoby od makłowicza ryż bistami w sobrym sosie teryiaki",
    properties: [
        { name: "Kalorie", value: "500 kcali" },
        { name: "Data ważności", value: "24.06.2026" },
        { name: "Białko", value: "10g" }
    ],
}}/>
