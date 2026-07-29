<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		value?: string;
	}

	let {
		value: selectedDate = $bindable()
	}: Props = $props();

	type CalendarDateElement = HTMLElement & {
		value: string;
	};

	let calendar = $state<CalendarDateElement | null>(null);
	let popover = $state<HTMLDivElement | null>(null);

	let callyReady = $state(false);

	onMount(() => {
		void (async () => {
			await import('cally');
			await customElements.whenDefined('calendar-date');

			callyReady = true;
		})();
	});

	function getLocalDateValue(date = new Date()): string {
		const localDate = new Date(
			date.getTime() - date.getTimezoneOffset() * 60_000
		);

		return localDate.toISOString().slice(0, 10);
	}

	function connectCalendar(node: HTMLElement) {
		const element = node as CalendarDateElement;

		calendar = element;

		$effect(() => {
			function handleChange() {
				selectedDate = element.value;

				if (popover?.matches(':popover-open')) {
					popover.hidePopover();
				}
			}

			element.addEventListener('change', handleChange);

			return () => {
				element.removeEventListener('change', handleChange);
			};
		});
	}

	function toggleCalendar() {
		if (!callyReady || !calendar || !popover) return;

		calendar.value = selectedDate || getLocalDateValue();

		if (popover.matches(':popover-open')) {
			popover.hidePopover();
			return;
		}

		popover.showPopover();

		requestAnimationFrame(() => {
			calendar?.focus();
		});
	}
</script>

<button
	type="button"
	class="input"
	disabled={!callyReady}
	onclick={toggleCalendar}
	style="anchor-name: --cally1"
>
	{selectedDate || 'Pick a date'}
</button>

<div
	bind:this={popover}
	popover
	class="dropdown bg-base-100 rounded-box shadow-lg"
	style="position-anchor: --cally1"
>
	<calendar-date use:connectCalendar class="cally">
		<span slot="previous" aria-label="Previous">
			<svg
				class="fill-current size-4"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path d="M15.75 19.5 8.25 12l7.5-7.5" />
			</svg>
		</span>

		<span slot="next" aria-label="Next">
			<svg
				class="fill-current size-4"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
			</svg>
		</span>

		<calendar-month></calendar-month>
	</calendar-date>
</div>