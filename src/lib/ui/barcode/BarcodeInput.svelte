<script lang="ts">
	import Scanner from './Scanner.svelte';

    interface Props {
        value?: string;
        name?: string;
    }

	let { value = $bindable(''), name }: Props = $props();

	let isScannerOpen = $state(false);
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

<div class="barcode-field">
	<div class="input-container">
		<input 
			type="text"
            name={name}
			bind:value={value} 
			placeholder="Enter barcode or scan..." 
		/>
		<button 
			type="button" 
			class="scan-trigger" 
			onclick={toggleScanner} 
			aria-expanded={isScannerOpen}
		>
			{isScannerOpen ? '✕ Cancel' : '📷 Scan'}
		</button>
	</div>

	{#if isScannerOpen}
		<div class="inline-scanner-panel">
			<div class="scanner-wrapper">
				<Scanner onScan={handleScan} />
			</div>

			<div class="scan-status">
				{#if tempScanValue}
					<p class="success">Code detected: <strong>{tempScanValue}</strong></p>
				{:else}
					<p class="waiting">Waiting for scan...</p>
				{/if}
			</div>

			<div class="panel-actions">
				<button 
					type="button"
					class="confirm-btn" 
					onclick={confirmScan} 
					disabled={!tempScanValue}
				>
					✓ Confirm & Apply
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.barcode-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		/* Ensure it doesn't blow out the parent modal */
		max-width: 500px; 
	}

	.input-container {
		display: flex;
		gap: 8px;
		width: 100%;
	}

	.input-container input {
		flex: 1;
		padding: 10px 12px;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
	}

	.scan-trigger {
		padding: 10px 16px;
		background-color: #f1f3f5;
		border: 1px solid #ccc;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: background-color 0.2s;
		min-width: 100px;
	}

	.scan-trigger:hover {
		background-color: #e9ecef;
	}

	/* Inline Panel Styles instead of Fixed Modal */
	.inline-scanner-panel {
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* Add a subtle shadow to separate it from the form background */
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
	}

	.scanner-wrapper {
		padding: 16px;
		background: #fff;
		border-bottom: 1px solid #eee;
	}

	.scan-status {
		padding: 12px 16px;
		text-align: center;
		font-size: 1rem;
		background: #f8f9fa;
	}

	.scan-status p {
		margin: 0;
	}

	.scan-status .success {
		color: #155724;
		background-color: #d4edda;
		padding: 10px;
		border-radius: 6px;
		border: 1px solid #c3e6cb;
	}

	.scan-status .waiting {
		color: #6c757d;
		font-style: italic;
	}

	.panel-actions {
		padding: 12px 16px 16px;
		background: #f8f9fa;
	}

	.confirm-btn {
		width: 100%;
		padding: 12px;
		font-size: 1.05rem;
		font-weight: bold;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.confirm-btn:hover:not(:disabled) {
		background-color: #218838;
	}

	.confirm-btn:disabled {
		background-color: #94d3a2;
		cursor: not-allowed;
	}
</style>