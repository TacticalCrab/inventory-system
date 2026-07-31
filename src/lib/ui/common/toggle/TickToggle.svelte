<script lang="ts">
    interface Props {
        name?: string;
        checked?: boolean;
    }

    let {
        name,
        checked = $bindable(false)
    }: Props = $props();

</script>

<label class="toggle text-base-content">
    <input
        type="checkbox"
        {name}
        bind:checked={checked}
        value={true}
    />

    <svg
        aria-label="disabled"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>

    <svg
        aria-label="enabled"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
    >
        <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="4"
            fill="none"
            stroke="currentColor"
        >
            <path d="M20 6 9 17l-5-5" />
        </g>
    </svg>


</label>