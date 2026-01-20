<script lang="ts">
	import { onMount } from 'svelte'
	import { getCurrentUser } from '$stores/user.svelte'
	import { getStoryState } from '$stores/story.svelte'
	import { getProgress } from '$stores/progress.svelte'

	let user = getCurrentUser()
	let story = getStoryState()
	let progress = getProgress()

	onMount(() => {
		if (!user) {
			window.location.href = '/'
		}
	})

	$: progress = getProgress()

	function selectChapter(chapterId: string) {
		window.location.href = `/story?chapter=${chapterId}`
	}

	function goToHome() {
		window.location.href = '/'
	}
</script>

<div class="chapters-container">
	<nav class="navbar">
		<button class="nav-btn" onclick={goToHome}>← Home</button>
		<h1 class="title">📚 Select Chapter</h1>
		<div class="user-info">
			<span class="user-avatar">{user?.avatar}</span>
		</div>
	</nav>

	<main class="chapters-content">
		<div class="chapters-grid">
			{#each story.chapters as chapter}
				<div
					class="chapter-card"
					class:completed={progress?.completedChapters[chapter.id]}
					class:locked={chapter.requirements.length > 0 &&
						!chapter.requirements.every((req) => progress?.completedChapters[req])}
				>
					<div class="chapter-number">Chapter {chapter.order}</div>
					<h2 class="chapter-title">{chapter.title}</h2>
					<p class="chapter-description">{chapter.description}</p>

					<div class="chapter-meta">
						<div class="meta-item">
							<span class="icon">📖</span>
							<span>{chapter.scenes.length} Scenes</span>
						</div>
						<div class="meta-item">
							<span class="icon">🎯</span>
							<span>{chapter.requirements.length || 'No'} Prerequisites</span>
						</div>
					</div>

					{#if progress?.completedChapters[chapter.id]}
						<button class="chapter-btn completed-btn" onclick={() => selectChapter(chapter.id)}>
							✅ Replay
						</button>
					{:else if chapter.requirements.length > 0 && !chapter.requirements.every((req) => progress?.completedChapters[req])}
						<button class="chapter-btn locked-btn" disabled>🔒 Locked</button>
					{:else}
						<button class="chapter-btn start-btn" onclick={() => selectChapter(chapter.id)}>
							▶ Start Chapter
						</button>
					{/if}
				</div>
			{/each}
		</div>
	</main>
</div>

<style>
	.chapters-container {
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
		font-size: 1.75rem;
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

	.chapters-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.chapters-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 2rem;
	}

	.chapter-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		transition: transform 0.2s;
	}

	.chapter-card:hover {
		transform: translateY(-5px);
	}

	.chapter-card.completed {
		background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
	}

	.chapter-card.locked {
		opacity: 0.6;
		filter: grayscale(0.5);
	}

	.chapter-number {
		display: inline-block;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.4rem 0.8rem;
		border-radius: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		margin-bottom: 1rem;
		align-self: flex-start;
	}

	.chapter-card.completed .chapter-number {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	}

	.chapter-title {
		font-size: 1.5rem;
		margin: 0 0 0.75rem 0;
		color: #333;
	}

	.chapter-description {
		color: #666;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
		flex: 1;
	}

	.chapter-meta {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: rgba(102, 126, 234, 0.1);
		border-radius: 0.5rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: #555;
	}

	.icon {
		font-size: 1.2rem;
	}

	.chapter-btn {
		width: 100%;
		padding: 1rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.start-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.start-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}

	.completed-btn {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
	}

	.completed-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
	}

	.locked-btn {
		background: #d1d5db;
		color: #9ca3af;
		cursor: not-allowed;
	}
</style>
