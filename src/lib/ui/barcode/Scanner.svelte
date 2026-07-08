<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Quagga from '@ericblade/quagga2';
	import type { QuaggaJSCodeReader, QuaggaJSReaderConfig } from '@ericblade/quagga2';

	interface Props {
		onScan?(code: string): void;
	}

	const { onScan }: Props = $props();

    const READERS: (QuaggaJSReaderConfig | QuaggaJSCodeReader)[] = ['ean_reader', 'ean_8_reader'];

	let videoElement: HTMLVideoElement | null = $state(null);

	let canvasElement: HTMLCanvasElement | null = $state(null);

	let devices: MediaDeviceInfo[] = $state([]);
	let selectedDeviceId = $state('');
	let scanResult: string | null = $state(null);
	let isProcessing = $state(false);
	
	let stream: MediaStream | null = null;

	// Fetch all available video devices
	async function getDevices() {
		try {
			// Request permission first to ensure device labels are exposed
			await navigator.mediaDevices.getUserMedia({ video: true });
			const allDevices = await navigator.mediaDevices.enumerateDevices();
			
			devices = allDevices.filter(device => device.kind === 'videoinput');
			
			// Auto-select the first available camera
			if (devices.length > 0 && !selectedDeviceId) {
				selectedDeviceId = devices[0].deviceId;
			}
		} catch (error) {
			console.error('Error accessing media devices.', error);
		}
	}

	// Start or restart the video stream based on the selected device ID
	async function startStream(deviceId: string) {
		// Stop any existing streams before starting a new one
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
		}
		
		if (!deviceId) return;

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: deviceId } }
			});
			
			if (videoElement) {
				videoElement.srcObject = stream;
			}
		} catch (error) {
			console.error('Error starting video stream.', error);
		}
	}

	// Reactively update the stream when the selected camera changes
	$effect(() => {
		if (selectedDeviceId) {
			startStream(selectedDeviceId);
		}
	});

	onMount(() => {
		getDevices();
	});

	// Cleanup the camera track when the component unmounts
	onDestroy(() => {
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
		}
	});

	// Capture the current video frame and decode it
    function captureAndProcess() {
		if (!videoElement || !canvasElement) return;

		isProcessing = true;
		scanResult = null;

		const context = canvasElement.getContext('2d');
        if (!context) {
            console.error("canvas context not found!");
            return;
        }
		
		const videoW = videoElement.videoWidth;
		const videoH = videoElement.videoHeight;

		// Calculate the exact pixel dimensions of our 70% x 35% CSS scan window
		const cropWidth = videoW * 0.70;
		const cropHeight = videoH * 0.35;
		
		// Calculate the starting X and Y coordinates to center the crop
		const cropX = (videoW - cropWidth) / 2;
		const cropY = (videoH - cropHeight) / 2;
		
		// Resize the canvas to match ONLY the cropped area, not the full video
		canvasElement.width = cropWidth;
		canvasElement.height = cropHeight;
		
		// Draw only the cropped portion of the video onto the canvas
		context.drawImage(
			videoElement, 
			cropX, cropY, cropWidth, cropHeight, // Source coordinates (the crop)
			0, 0, cropWidth, cropHeight          // Destination coordinates (the canvas)
		);
		
		const dataUrl = canvasElement.toDataURL('image/jpeg');

		Quagga.decodeSingle({
			src: dataUrl,
			numOfWorkers: 0, 
			inputStream: {
				size: 800 // Now, the 800px size applies strictly to the zoomed-in barcode!
			},
			decoder: {
				readers: READERS // Locked to EAN for your specific use case
			},
			locate: true,
		}, (result) => {
			isProcessing = false;
			if (result?.codeResult?.code) {
				scanResult = result.codeResult.code;
				onScan?.(scanResult);
			} else {
				scanResult = 'No barcode detected. Please try again.';
			}
		});
	}
</script>

<div class="scanner-container">
	<div class="controls">
		<select bind:value={selectedDeviceId}>
			{#each devices as device (device.deviceId)}
				<option value={device.deviceId}>
					{device.label || `Camera ${devices.indexOf(device) + 1}`}
				</option>
			{/each}
		</select>
	</div>

	<div class="video-wrapper">
		<video bind:this={videoElement} autoplay playsinline muted></video>
		
		<div class="overlay">
			<div class="scan-window"></div>
		</div>
	</div>

	<div class="actions">
		<button onclick={captureAndProcess} disabled={isProcessing}>
			{isProcessing ? 'Processing...' : 'Capture & Scan'}
		</button>
	</div>

	{#if scanResult}
		<div class="result">
			<strong>Result:</strong> {scanResult}
		</div>
	{/if}

	<canvas bind:this={canvasElement} style="display: none;"></canvas>
</div>

<style>
	.scanner-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		max-width: 100%;
		font-family: system-ui, -apple-system, sans-serif;
	}

	.controls select {
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 1rem;
		border: 1px solid #ccc;
		background: #fff;
	}

	.video-wrapper {
		position: relative;
		width: 100%;
		max-width: 500px;
		border-radius: 12px;
		overflow: hidden;
		background: #000;
		aspect-ratio: 4/3;
		display: flex;
		align-items: center;
	}

	video {
		width: 100%;
		height: auto;
		display: block;
	}

	/* Creates the transparent cutout effect */
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.scan-window {
		width: 70%;
		height: 35%;
		border: 2px solid #00ff00;
		border-radius: 12px;
		/* The huge box-shadow dims everything outside this element */
		box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.6);
	}

	.actions button {
		padding: 12px 24px;
		font-size: 1rem;
		font-weight: 600;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.actions button:hover:not(:disabled) {
		background-color: #0056b3;
	}
	
	.actions button:disabled {
		background-color: #94c2ed;
		cursor: not-allowed;
	}

	.result {
		padding: 12px 20px;
		background: #eef7ff;
		color: #004085;
		border: 1px solid #b8daff;
		border-radius: 6px;
		font-size: 1.1rem;
		text-align: center;
	}
</style>