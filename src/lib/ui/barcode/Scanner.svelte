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

<div class="flex w-full flex-col items-center gap-4 text-base-content">
	<div class="w-full">
		<select
			bind:value={selectedDeviceId}
			class="w-full rounded-box border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
		>
			{#each devices as device (device.deviceId)}
				<option value={device.deviceId}>
					{device.label || `Camera ${devices.indexOf(device) + 1}`}
				</option>
			{/each}
		</select>
	</div>

	<div class="relative w-full max-w-xl overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-md aspect-4/3">
		<video bind:this={videoElement} autoplay playsinline muted class="block h-full w-full object-cover"></video>

		<div class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
			<div class="h-[35%] w-[70%] rounded-box border-2 border-success shadow-[0_0_0_4000px_rgba(15,23,42,0.6)]"></div>
		</div>
	</div>

	<div class="w-full">
		<button
			onclick={captureAndProcess}
			disabled={isProcessing}
			class="w-full rounded-box bg-primary px-6 py-3 text-sm font-semibold text-primary-content shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{isProcessing ? 'Processing...' : 'Capture & Scan'}
		</button>
	</div>

	{#if scanResult}
		<div class="w-full rounded-box border border-info/30 bg-info/10 px-4 py-3 text-center text-sm font-medium text-base-content shadow-sm">
			<strong>Result:</strong> {scanResult}
		</div>
	{/if}

	<canvas bind:this={canvasElement} class="hidden"></canvas>
</div>