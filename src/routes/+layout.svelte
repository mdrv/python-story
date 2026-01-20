<script lang="ts">
	import { onMount } from 'svelte'
	import { getCurrentUser } from '$stores/user.svelte.ts'
	import { initPyodide } from '$stores/pyodide.svelte.ts'
	import '../../app.css'

	import favicon from '$lib/assets/favicon.svg'

	let { children } = $props()

	let user = getCurrentUser()

	onMount(() => {
		initPyodide()
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Python Story - Learn Python Through Adventure</title>
</svelte:head>

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
</style>
