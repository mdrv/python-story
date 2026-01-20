<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { EditorView } from '@codemirror/view'
	import { EditorState, Compartment } from '@codemirror/state'
	import { python } from '@codemirror/lang-python'
	import { keymap, highlightSpecialChars } from '@codemirror/view'
	import { defaultKeymap, indentWithTab } from '@codemirror/commands'
	import { executeWithTimeout, resetEnvironment } from '$stores/pyodide.svelte'
	import { unlockAchievement, markExerciseComplete, updateConceptMastery } from '$stores/progress.svelte'
	import type { Challenge as ChallengeType } from '$lib/types'

	interface Props {
		challenge: ChallengeType
		onComplete: () => void
		onClose: () => void
	}

	let { challenge, onComplete, onClose }: Props = $props()

	let editorParent: HTMLElement
	let view: EditorView | null = null
	let code = $state(challenge.starterCode || '')
	let output = $state('')
	let error = $state('')
	let isRunning = $state(false)
	let hintIndex = $state(-1)
	let showSolution = $state(false)
	let attempts = $state(0)

	let languageCompartment = new Compartment()

	function initEditor() {
		if (!editorParent || view) return

		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				code = update.state.doc.toString()
			}
		})

		view = new EditorView({
			state: EditorState.create({
				doc: code,
				extensions: [
					oneDark,
					languageCompartment.of(python()),
					keymap.of([...defaultKeymap, indentWithTab]),
					highlightSpecialChars(),
					EditorView.theme({
						'&': { height: '300px', fontSize: '14px' },
						'.cm-scroller': { overflow: 'auto' },
						'.cm-content': { fontFamily: 'monospace' }
					}),
					updateListener
				]
			}),
			parent: editorParent
		})
	}

	async function runCode() {
		if (isRunning || !view) return

		isRunning = true
		output = ''
		error = ''

		const result = await executeWithTimeout(code, 5000)
		output = result.output
		error = result.error || ''

		if (!error && output.trim().length > 0) {
			attempts++
			markExerciseComplete(challenge.problem, attempts, code)
			updateConceptMastery(challenge.lesson, 25)
			unlockAchievement('first-print')

			if (challenge.lesson === 'variables') {
				unlockAchievement('first-variable')
			}
			if (challenge.lesson === 'for-loops') {
				unlockAchievement('first-loop')
			}
			if (challenge.lesson === 'conditionals') {
				unlockAchievement('first-conditional')
			}

			setTimeout(() => {
				onComplete()
			}, 1500)
		}

		isRunning = false
	}

	function showHint() {
		if (hintIndex < challenge.hints.length - 1) {
			hintIndex++
		}
	}

	function resetCode() {
		code = challenge.starterCode || ''
		if (view) {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: code }
			})
		}
		output = ''
		error = ''
		hintIndex = -1
		showSolution = false
		resetEnvironment()
	}

	function showTheSolution() {
		showSolution = true
	}

	onMount(() => {
		initEditor()
	})

	onDestroy(() => {
		if (view) view.destroy()
	})

	const oneDark = EditorView.theme({
		'&': {
			backgroundColor: '#1e1e1e',
			color: '#d4d4d4'
		},
		'.cm-gutters': {
			backgroundColor: '#252526',
			border: 'none'
		},
		'.cm-activeLine': {
			backgroundColor: '#2a2a2b'
		},
		'.cm-activeLineGutter': {
			backgroundColor: '#2a2a2b'
		}
	})
</script>

<div class="challenge">
	<div class="challenge-header">
		<h3>💻 {challenge.type === 'quiz' ? 'Quiz' : 'Coding Challenge'}</h3>
		<button class="close-btn" onclick={onClose}>✕</button>
	</div>

	<div class="challenge-content">
		<div class="problem">
			<h4>Problem:</h4>
			<p>{challenge.problem}</p>
		</div>

		<div class="editor-container">
			<div class="editor-wrapper" bind:this={editorParent}></div>
		</div>

		<div class="output-panel">
			<h4>Output:</h4>
			<pre class:error={error}>{error || output || 'Run your code to see output...'}</pre>
		</div>

		<div class="actions">
			<div class="main-actions">
				<button class="btn btn-run" onclick={runCode} disabled={isRunning}>
					{isRunning ? 'Running...' : '▶ Run Code'}
				</button>
				<button class="btn btn-reset" onclick={resetCode}>🔄 Reset</button>
			</div>

			<div class="hint-actions">
				<button class="btn btn-hint" onclick={showHint} disabled={hintIndex >= challenge.hints.length - 1}>
					💡 Hint
				</button>
				{#if hintIndex >= 0}
					<div class="hint-box">
						<strong>Hint {hintIndex + 1}:</strong> {challenge.hints[hintIndex]}
					</div>
				{/if}

				{#if attempts >= 2}
					<button class="btn btn-solution" onclick={showTheSolution}>👁️ Show Solution</button>
				{/if}
			</div>
		</div>

		{#if showSolution}
			<div class="solution-box">
				<h4>💡 Solution:</h4>
				<pre class="solution-code">{challenge.solution}</pre>
			</div>
		{/if}

		{#if !error && output && output.trim().length > 0}
			<div class="success-message">
				🎉 <strong>Correct!</strong> Great job solving this challenge!
			</div>
		{/if}
	</div>
</div>

<style>
	.challenge {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	.challenge-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.challenge-header h3 {
		margin: 0;
		color: #333;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #666;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: #ef4444;
	}

	.problem {
		margin-bottom: 1.5rem;
	}

	.problem h4 {
		margin: 0 0 0.5rem 0;
		color: #555;
	}

	.problem p {
		font-size: 1.1rem;
		line-height: 1.6;
		color: #333;
	}

	.editor-container {
		margin-bottom: 1.5rem;
		border: 2px solid #e0e0e0;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.editor-wrapper {
		background: #1e1e1e;
	}

	.output-panel {
		margin-bottom: 1.5rem;
	}

	.output-panel h4 {
		margin: 0 0 0.5rem 0;
		color: #555;
	}

	.output-panel pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 0.5rem;
		font-family: monospace;
		font-size: 0.9rem;
		white-space: pre-wrap;
		word-break: break-all;
		margin: 0;
	}

	.output-panel pre.error {
		background: #fef2f2;
		color: #dc2626;
		border: 2px solid #fecaca;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.main-actions {
		display: flex;
		gap: 1rem;
	}

	.hint-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-run {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		flex: 1;
	}

	.btn-run:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
	}

	.btn-reset {
		background: #f3f4f6;
		color: #333;
	}

	.btn-reset:hover {
		background: #e5e7eb;
	}

	.btn-hint {
		background: #fef3c7;
		color: #92400e;
		text-align: left;
	}

	.btn-hint:hover:not(:disabled) {
		background: #fde68a;
	}

	.btn-solution {
		background: #e0e7ff;
		color: #4338ca;
	}

	.btn-solution:hover {
		background: #c7d2fe;
	}

	.hint-box {
		background: #fef3c7;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.95rem;
		color: #92400e;
	}

	.solution-box {
		background: #e0e7ff;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-top: 1rem;
	}

	.solution-box h4 {
		margin: 0 0 0.5rem 0;
		color: #4338ca;
	}

	.solution-code {
		background: white;
		padding: 1rem;
		border-radius: 0.5rem;
		font-family: monospace;
		font-size: 0.9rem;
		overflow-x: auto;
		margin: 0;
	}

	.success-message {
		background: #d1fae5;
		padding: 1rem;
		border-radius: 0.5rem;
		color: #047857;
		font-size: 1.1rem;
		margin-top: 1rem;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
