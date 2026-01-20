<script lang="ts">
	import { onMount } from 'svelte'
	import { getCurrentUser } from '$stores/user.svelte'
	import { getProgress, getCompletionPercentage, getUnlockedAchievements } from '$stores/progress.svelte'
	import { getStoryState } from '$stores/story.svelte'

	let user = $derived(getCurrentUser())
	let progress = $derived(getProgress())
	let story = getStoryState()
	let unlockedAchievements = $derived(getUnlockedAchievements())

	onMount(() => {
		if (!user) {
			window.location.href = '/'
		}
	})

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60

		if (hours > 0) {
			return `${hours}h ${minutes}m`
		}
		if (minutes > 0) {
			return `${minutes}m ${secs}s`
		}
		return `${secs}s`
	}

	function goToStory() {
		window.location.href = '/chapters'
	}

	function goToHome() {
		window.location.href = '/'
	}
</script>

<div class="dashboard-container">
	<nav class="navbar">
		<button class="nav-btn" on:click={goToHome}>← Home</button>
		<h1 class="title">📊 Progress Dashboard</h1>
		<div class="user-info">
			<span class="user-avatar">{user?.avatar}</span>
		</div>
	</nav>

	<main class="dashboard-content">
		<section class="overview-cards">
			<div class="card">
				<div class="card-icon">📖</div>
				<div class="card-content">
					<div class="card-value">{Object.keys(progress?.completedChapters || {}).length}/{story.chapters.length}</div>
					<div class="card-label">Chapters Complete</div>
				</div>
			</div>

			<div class="card">
				<div class="card-icon">✅</div>
				<div class="card-content">
					<div class="card-value">{Object.keys(progress?.completedExercises || {}).length}</div>
					<div class="card-label">Exercises Done</div>
				</div>
			</div>

			<div class="card">
				<div class="card-icon">🔥</div>
				<div class="card-content">
					<div class="card-value">{progress?.currentStreak || 0}</div>
					<div class="card-label">Day Streak</div>
				</div>
			</div>

			<div class="card">
				<div class="card-icon">⏱️</div>
				<div class="card-content">
					<div class="card-value">{formatTime(progress?.totalTime || 0)}</div>
					<div class="card-label">Time Spent</div>
				</div>
			</div>
		</section>

		<section class="chapters-progress">
			<h2>Chapter Progress</h2>
			<div class="chapter-list">
				{#each story.chapters as chapter}
					<div class="chapter-item" class:completed={progress?.completedChapters[chapter.id]}>
						<div class="chapter-header">
							<span class="chapter-number">Chapter {chapter.order}</span>
							<span class="chapter-icon">{progress?.completedChapters[chapter.id] ? '✅' : '📖'}</span>
						</div>
						<h3 class="chapter-title">{chapter.title}</h3>
						<p class="chapter-desc">{chapter.description}</p>
						<div class="chapter-bar">
							<div class="bar-fill" style="width: {progress?.completedChapters[chapter.id] ? '100%' : '0%'}"></div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="achievements">
			<h2>Achievements ({unlockedAchievements.length})</h2>
			<div class="achievements-grid">
				{#if unlockedAchievements.length > 0}
					{#each unlockedAchievements as achievement}
						<div class="achievement-badge">
							<div class="badge-icon">{achievement.icon}</div>
							<div class="badge-info">
								<div class="badge-title">{achievement.title}</div>
								<div class="badge-desc">{achievement.description}</div>
							</div>
						</div>
					{/each}
				{:else}
					<p class="no-achievements">No achievements yet. Keep learning!</p>
				{/if}
			</div>
		</section>

		<section class="action-buttons">
			<button class="btn btn-primary" on:click={goToStory}>Select Chapter →</button>
		</section>
	</main>
</div>

<style>
	.dashboard-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
	}

	.nav-btn {
		padding: 0.5rem 1rem;
		background: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}

	.nav-btn:hover {
		background: #f8f9ff;
	}

	.title {
		margin: 0;
		color: white;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.user-avatar {
		font-size: 2rem;
	}

	.dashboard-content {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.overview-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.card {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.card-icon {
		font-size: 3rem;
	}

	.card-content {
		flex: 1;
	}

	.card-value {
		font-size: 2rem;
		font-weight: 700;
		color: #333;
	}

	.card-label {
		color: #666;
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}

	.chapters-progress h2,
	.achievements h2 {
		color: white;
		font-size: 1.75rem;
		margin-bottom: 1.5rem;
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-bottom: 2.5rem;
	}

	.chapter-item {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.chapter-item.completed {
		background: #d1fae5;
	}

	.chapter-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.chapter-number {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.chapter-icon {
		font-size: 1.5rem;
	}

	.chapter-title {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.25rem;
	}

	.chapter-desc {
		margin: 0 0 1rem 0;
		color: #666;
		line-height: 1.6;
	}

	.chapter-bar {
		background: #e0e0e0;
		border-radius: 1rem;
		height: 0.5rem;
		overflow: hidden;
	}

	.bar-fill {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		height: 100%;
		border-radius: 1rem;
		transition: width 0.3s ease-out;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
		margin-bottom: 2.5rem;
	}

	.achievement-badge {
		background: white;
		border-radius: 1rem;
		padding: 1.25rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.badge-icon {
		font-size: 2.5rem;
	}

	.badge-info {
		flex: 1;
	}

	.badge-title {
		font-weight: 600;
		color: #333;
		margin-bottom: 0.25rem;
	}

	.badge-desc {
		color: #666;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.no-achievements {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.1rem;
		text-align: center;
		padding: 2rem;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
	}

	.btn {
		padding: 1rem 2rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: white;
		color: #667eea;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}
</style>
