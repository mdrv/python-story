<script lang="ts">
	import { onMount } from 'svelte'
	import { createProfile, createGuestProfile, getAvatars, getProfiles } from '$stores/user.svelte.ts'
	import { loadProgress } from '$stores/progress.svelte.ts'

	let displayName = ''
	let selectedAvatar = ''
	let showAvatarPicker = false

	let avatars = getAvatars()
	let profiles = getProfiles()

	onMount(() => {
		selectedAvatar = avatars[0]
	})

	function handleCreateProfile() {
		if (displayName.trim()) {
			const profile = createProfile(displayName.trim(), selectedAvatar)
			loadProgress(profile.id)
			window.location.href = '/story'
		}
	}

	function handleContinueAsGuest() {
		const profile = createGuestProfile()
		loadProgress(profile.id)
		window.location.href = '/story'
	}

	function selectProfile(profileId: string) {
		const profile = profiles.find((p) => p.id === profileId)
		if (profile) {
			loadProgress(profile.id)
			window.location.href = '/story'
		}
	}

	function selectAvatar(avatar: string) {
		selectedAvatar = avatar
		showAvatarPicker = false
	}
</script>

<div class="container">
	<div class="header">
		<h1 class="title">🐍 Python Story</h1>
		<p class="subtitle">Learn Python Through Adventure</p>
	</div>

	{#if profiles.length > 0}
		<div class="profiles-section">
			<h2>Select Your Profile</h2>
			<div class="profiles-list">
				{#each profiles as profile}
					<button class="profile-card" on:click={() => selectProfile(profile.id)}>
						<span class="profile-avatar">{profile.avatar}</span>
						<span class="profile-name">{profile.displayName}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="create-section">
		<h2>Create New Profile</h2>
		<div class="form-group">
			<label for="displayName">Your Name</label>
			<input
				id="displayName"
				type="text"
				bind:value={displayName}
				placeholder="Enter your name"
				class="input"
			/>
		</div>

		<div class="form-group">
			<label>Choose Your Avatar</label>
			<button class="avatar-picker-btn" on:click={() => (showAvatarPicker = !showAvatarPicker)}>
				<span class="selected-avatar">{selectedAvatar}</span>
				<span class="picker-label">{showAvatarPicker ? 'Close' : 'Change'}</span>
			</button>

			{#if showAvatarPicker}
				<div class="avatar-grid">
					{#each avatars as avatar}
						<button
							class="avatar-option"
							class:active={avatar === selectedAvatar}
							on:click={() => selectAvatar(avatar)}
						>
							{avatar}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<button class="btn btn-primary" on:click={handleCreateProfile} disabled={!displayName.trim()}>
			Start Adventure
		</button>
	</div>

	<div class="guest-section">
		<button class="btn btn-secondary" on:click={handleContinueAsGuest}>Play as Guest</button>
	</div>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
		color: white;
	}

	.title {
		font-size: 3rem;
		font-weight: 700;
		margin: 0;
	}

	.subtitle {
		font-size: 1.25rem;
		margin-top: 0.5rem;
		opacity: 0.9;
	}

	.profiles-section,
	.create-section,
	.guest-section {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.profiles-section h2,
	.create-section h2 {
		margin-top: 0;
		color: #333;
		font-size: 1.5rem;
	}

	.profiles-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.profile-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 0.5rem;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.profile-card:hover {
		border-color: #667eea;
		background: #f8f9ff;
	}

	.profile-avatar {
		font-size: 2rem;
	}

	.profile-name {
		font-size: 1.1rem;
		font-weight: 600;
		color: #333;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #555;
	}

	.input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 0.5rem;
		font-size: 1rem;
		box-sizing: border-box;
	}

	.input:focus {
		outline: none;
		border-color: #667eea;
	}

	.avatar-picker-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 0.5rem;
		background: white;
		cursor: pointer;
		font-size: 1rem;
	}

	.selected-avatar {
		font-size: 2rem;
	}

	.picker-label {
		color: #667eea;
		font-weight: 600;
	}

	.avatar-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.avatar-option {
		font-size: 2rem;
		padding: 0.5rem;
		border: 2px solid #e0e0e0;
		border-radius: 0.5rem;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.avatar-option:hover {
		border-color: #667eea;
	}

	.avatar-option.active {
		border-color: #667eea;
		background: #f8f9ff;
	}

	.btn {
		width: 100%;
		padding: 0.75rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: transparent;
		color: white;
		border: 2px solid white;
	}

	.btn-secondary:hover {
		background: white;
		color: #667eea;
	}
</style>
