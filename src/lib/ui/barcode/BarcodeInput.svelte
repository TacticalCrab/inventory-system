<script lang="ts">
	import Scanner from './Scanner.svelte';

    interface Props {
        value?: string;
		isScannerOpen?: boolean;
        name?: string;
    }

	let { 
		value = $bindable(''),
		isScannerOpen = $bindable(false),
		name 
	}: Props = $props();

	let tempScanValue = $state('');

	function toggleScanner() {
		// If opening, clear any previous temporary scans
		if (!isScannerOpen) {
			tempScanValue = '';
		}
		isScannerOpen = !isScannerOpen;
	}

	function handleScan(scannedCode: string) {
		tempScanValue = scannedCode;
	}

	function confirmScan() {
		if (tempScanValue) {
			value = tempScanValue;
		}
		isScannerOpen = false;
	}
</script>

<div class="flex w-full max-w-xl flex-col gap-3">
	<div class="flex flex-wrap gap-2">
		<input
			type="text"
			name={name}
			bind:value={value}
			placeholder="Enter barcode or scan..."
			class="min-w-0 flex-1 rounded-box border border-base-300 bg-base-100 px-4 py-3 text-base text-base-content shadow-sm outline-none transition placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
		/>
		<button
			type="button"
			class="min-w-28 rounded-box border border-base-300 bg-base-200 px-4 py-3 text-sm font-medium text-base-content shadow-sm transition hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
			onclick={toggleScanner}
			aria-expanded={isScannerOpen}
		>
			{isScannerOpen ? '✕ Cancel' : '📷 Scan'}
		</button>
	</div>

	{#if isScannerOpen}
		<div class="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-md">
			<div class="border-b border-base-300 p-4">
				<Scanner onScan={handleScan} />
			</div>

			<div class="border-b border-base-300 bg-base-200 px-4 py-3 text-center">
				{#if tempScanValue}
					<p class="rounded-box border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-base-content">
						Code detected: <strong>{tempScanValue}</strong>
					</p>
				{:else}
					<p class="text-sm text-base-content/70">Waiting for scan...</p>
				{/if}
			</div>

			<div class="bg-base-200 p-4">
				<button
					type="button"
					class="w-full rounded-box bg-success px-4 py-3 text-sm font-semibold text-base-100 shadow-sm transition hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success/30 disabled:cursor-not-allowed disabled:opacity-60"
					onclick={confirmScan}
					disabled={!tempScanValue}
				>
					✓ Confirm & Apply
				</button>
			</div>
		</div>
	{/if}
</div>