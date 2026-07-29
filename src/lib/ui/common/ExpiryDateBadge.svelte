<script lang="ts">
	interface Props {
		expiryDate?: string | Date | null;
		warningDays?: number;
		dangerDays?: number;
		locale?: string;
	}

	let {
		expiryDate,
		warningDays = 14,
		dangerDays = 3,
		locale = "pl-PL"
	}: Props = $props();

	const DAY_MS = 86_400_000;

	function parseDate(value: string | Date): Date {
		if (value instanceof Date) {
			return new Date(value);
		}

		// Prevent YYYY-MM-DD from being interpreted as UTC
		const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

		if (match) {
			return new Date(
				Number(match[1]),
				Number(match[2]) - 1,
				Number(match[3])
			);
		}

		return new Date(value);
	}

	function calendarDay(date: Date): number {
		return Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);
	}

	const state = $derived.by(() => {
		if (!expiryDate) {
			return {
				dateLabel: "No date",
				statusLabel: "No expiry",
				className: "badge-neutral",
				dateTime: undefined
			};
		}

		const date = parseDate(expiryDate);

		if (Number.isNaN(date.getTime())) {
			return {
				dateLabel: "Invalid date",
				statusLabel: "",
				className: "badge-neutral",
				dateTime: undefined
			};
		}

		const today = new Date();
		const daysLeft = Math.round(
			(calendarDay(date) - calendarDay(today)) / DAY_MS
		);

		const dateLabel = new Intl.DateTimeFormat(locale, {
			day: "2-digit",
			month: "short",
			year:
				date.getFullYear() !== today.getFullYear()
					? "numeric"
					: undefined
		}).format(date);

		const dateTime = [
			date.getFullYear(),
			String(date.getMonth() + 1).padStart(2, "0"),
			String(date.getDate()).padStart(2, "0")
		].join("-");

		if (daysLeft < 0) {
			return {
				dateLabel,
				statusLabel: `${Math.abs(daysLeft)}d overdue`,
				className: "badge-error",
				dateTime
			};
		}

		if (daysLeft === 0) {
			return {
				dateLabel,
				statusLabel: "Expires today",
				className: "badge-error",
				dateTime
			};
		}

		if (daysLeft <= dangerDays) {
			return {
				dateLabel,
				statusLabel: `${daysLeft}d left`,
				className: "badge-error",
				dateTime
			};
		}

		if (daysLeft <= warningDays) {
			return {
				dateLabel,
				statusLabel: `${daysLeft}d left`,
				className: "badge-warning",
				dateTime
			};
		}

		return {
			dateLabel,
			statusLabel: `${daysLeft}d left`,
			className: "badge-success",
			dateTime
		};
	});
</script>

<time
	datetime={state.dateTime}
	class={`badge badge-soft badge-sm h-auto gap-1.5 whitespace-nowrap px-2 py-1 ${state.className}`}
>
	<svg
		class="size-3.5 shrink-0"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 7v5l3 2" />
	</svg>

	<span class="font-medium">{state.dateLabel}</span>

	{#if state.statusLabel}
		<span class="opacity-40" aria-hidden="true">•</span>
		<span>{state.statusLabel}</span>
	{/if}
</time>