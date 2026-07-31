<script lang="ts">
	import './layout.css';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import ToastContainer from '$lib/ui/toaster/ToastContainer.svelte';
	import { setToastContext } from '$lib/ui/toaster/toast.svelte';
	import ThemeToggle from '$lib/ui/common/toggle/ThemeToggle.svelte';
	import SettingsButton from '$lib/ui/common/buttons/SettingsButton.svelte';
	import { goto } from '$app/navigation';

	setToastContext();

	let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-10">
	<div class="flex justify-between w-full items-center">
		<div class="flex sm:items-center flex-col sm:flex-row">
			<a 
				href={resolve("/")}
				class="btn btn-ghost text-xl">
				Inventory System
			</a>
			<div class="flex gap-2 ml-4 ">
				<a href={resolve('/items')} aria-label="items">
					Items
				</a>
				<div class="dropdown dropdown-hover">
					<a href={resolve('/locations')} aria-label="items">
						<div tabindex="0" role="button">
							Locations
						</div>
					</a>
					<ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
						{#each data.locations as location (location.id)}
							<li>
								<a href={resolve(`/locations/${location.id}`)} aria-label={location.name}>
									{location.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
		<div class="flex gap-2 items-center">
			<ThemeToggle defaultTheme={data.config.defaultTheme}/>
			<SettingsButton onclick={() => goto(resolve("/settings"))}/>
		</div>
		
	</div>
</div>
{@render children()}

<ToastContainer />
