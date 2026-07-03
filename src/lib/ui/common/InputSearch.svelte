<script lang="ts">
    interface Props {
        value?: string;
        onSearchClick?(): void;
    }

    let {
        value = $bindable(),
        onSearchClick
    }: Props = $props();

</script>

<div class="join">
    <label class="input">
        <input bind:value={value} type="search" class="grow" placeholder="Search" />
    </label>
    <button onclick={onSearchClick} class="btn btn-neutral join-item" type="button" aria-label="Search">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
    </button>
</div>