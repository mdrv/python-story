<script lang="ts">
	import { onMount } from 'svelte'
	import { getCurrentUser } from '$stores/user.svelte'
	import {
		getStoryState,
		setChapter,
		setScene,
		getSceneState,
		goToNextScene,
		getChapterState
	} from '$stores/story.svelte'
	import {
		markSceneComplete,
		markChapterComplete,
		getProgress,
		loadProgress
	} from '$stores/progress.svelte'
	import Challenge from './Challenge.svelte'

	let user = getCurrentUser()
	let story = getStoryState()
	let currentScene = getSceneState()
	let showChallenge = false

	onMount(() => {
		if (!user) {
			window.location.href = '/'
		} else {
			setChapter('chapter-1')
		}
	})

	$: currentScene = getSceneState()

	function handleChoice(choiceId: string) {
		const choice = currentScene?.choices?.find((c: any) => c.id === choiceId)
		if (choice) {
			setScene(choice.targetSceneId)
			markSceneComplete(currentScene?.id || '')
		}
	}

	function handleChallengeComplete() {
		showChallenge = false
		markSceneComplete(currentScene?.id || '')
	}

	function handleContinue() {
		markSceneComplete(currentScene?.id || '')

		const nextScene = goToNextScene()
		if (!nextScene) {
			const chapter = getChapterState()
			if (chapter) {
				markChapterComplete(chapter.id)
				alert(`🎉 Congratulations! You completed Chapter ${chapter.order}: ${chapter.title}!`)
			}
		}
	}

	function handleBackToHome() {
		window.location.href = '/'
	}
</script>

<div class="story-container">
	<nav class="navbar">
		<div class="nav-left">
			<button class="nav-btn" on:click={handleBackToHome}>← Home</button>
			<a href="/progress" class="nav-link">📊 Progress</a>
		</div>
		<div class="user-info">
			<span class="user-avatar">{user?.avatar}</span>
			<span class="user-name">{user?.displayName}</span>
		</div>
	</nav>

	<main class="story-content">
		{#if currentScene}
			<div class="scene">
				{#if currentScene.character}
					<div class="character">
						<span class="character-avatar">{currentScene.character.avatar}</span>
						<span class="character-name">{currentScene.character.name}</span>
					</div>
				{/if}

				<div class="scene-text">
					<p>{currentScene.text}</p>
				</div>

				{#if currentScene.challenge}
					<div class="challenge-container">
						{#if !showChallenge}
							<button class="challenge-btn" on:click={() => (showChallenge = true)}>
								💻 Help with Python
							</button>
						{:else}
							<Challenge
								challenge={currentScene.challenge}
								onComplete={handleChallengeComplete}
								onClose={() => (showChallenge = false)}
							/>
						{/if}
					</div>
				{/if}

				{#if currentScene.choices && currentScene.choices.length > 0}
					<div class="choices">
						{#each currentScene.choices as choice}
							<button
								class="choice-btn"
								class:recommended={choice.isRecommended}
								on:click={() => handleChoice(choice.id)}
							>
								{#if choice.isRecommended}⭐ {/if}
								{choice.text}
							</button>
						{/each}
					</div>
				{:else}
					<button class="continue-btn" on:click={handleContinue}>Continue →</button>
				{/if}
			</div>
		{/if}
	</main>
</div>

<style>
	.story-container {
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

	.nav-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.nav-btn,
	.nav-link {
		padding: 0.5rem 1rem;
		background: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
		text-decoration: none;
		color: #333;
	}

	.nav-btn:hover,
	.nav-link:hover {
		background: #f8f9ff;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: white;
	}

	.user-avatar {
		font-size: 2rem;
	}

	.user-name {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.story-content {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.scene {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
	}

	.character {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.character-avatar {
		font-size: 3rem;
	}

	.character-name {
		font-size: 1.5rem;
		font-weight: 600;
		color: #333;
	}

	.scene-text {
		margin-bottom: 2rem;
	}

	.scene-text p {
		font-size: 1.25rem;
		line-height: 1.8;
		color: #444;
	}

	.challenge-container {
		margin: 2rem 0;
	}

	.challenge-btn {
		width: 100%;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.2rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.challenge-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.choice-btn {
		padding: 1rem;
		background: white;
		border: 2px solid #e0e0e0;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.choice-btn:hover {
		border-color: #667eea;
		background: #f8f9ff;
	}

	.choice-btn.recommended {
		border-color: #fbbf24;
		background: #fffbeb;
	}

	.continue-btn {
		width: 100%;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.2rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.continue-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}
</style>
