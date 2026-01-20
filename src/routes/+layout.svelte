<script lang="ts">
	import { onMount } from 'svelte'
	import { getCurrentUser } from '$stores/user.svelte'
	import { initPyodide, isPyodideLoading, getPyodideLoadError } from '$stores/pyodide.svelte'
	import '../app.css'

	import favicon from '$lib/assets/favicon.svg'

	let { children } = $props()

	let user = getCurrentUser()
	let pyodideLoading = $derived(isPyodideLoading())
	let pyodideError = $derived(getPyodideLoadError())
	let showNotification = $state(false)
	let notificationMessage = $state('')
	let notificationType = $state<'success' | 'error'>('success')

	onMount(() => {
		initPyodide()
	})

	$effect(() => {
		// if (!pyodideLoading && !pyodideError) {
		// 	// Pyodide loaded successfully
		// 	notificationMessage = '✅ Python environment ready!'
		// 	notificationType = 'success'
		// 	showNotification = true
		// 	setTimeout(() => {
		// 		showNotification = false
		// 	}, 3000)
		// } else if (pyodideError) {
		if (pyodideError) {
			// Pyodide failed to load
			notificationMessage = `❌ ${pyodideError}`
			notificationType = 'error'
			showNotification = true
		}
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Python Story - Learn Python Through Adventure</title>
</svelte:head>

{#if showNotification}
	<div class="notification {notificationType}">
		{notificationMessage}
	</div>
{/if}

<div class="app">
	{#if user}
		{@render children()}
	{:else}
		{@render children()}
	{/if}
</div>

<style>
	.app {
		min-height: 100vh;
	}

	.notification {
		position: fixed;
		top: 1rem;
		right: 1rem;
		padding: 1rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 9999;
		animation: slideIn 0.3s ease-out;
	}

	.notification.success {
		background: #10b981;
		color: white;
	}

	.notification.error {
		background: #ef4444;
		color: white;
	}

	@keyframes slideIn {
		from {
			transform: translateX(400px);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
