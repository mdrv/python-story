import type { CodeExecutionResult } from '$lib/types.ts'

let pyodideInstance: any = null
let isLoading = $state(true)
let loadError = $state<string | null>(null)

export function isPyodideLoading(): boolean {
  return isLoading
}

export function getPyodideLoadError(): string | null {
  return loadError
}

export function getPyodideInstance(): any {
  return pyodideInstance
}

export async function initPyodide(): Promise<void> {
  if (pyodideInstance) return

  try {
    const pyodide = await (window as any).loadPyodide({
      stdout: (text: string) => {
        console.log('Pyodide stdout:', text)
      },
      stderr: (text: string) => {
        console.error('Pyodide stderr:', text)
      }
    })

    await pyodide.loadPackage(['micropip'])

    pyodideInstance = pyodide
    isLoading = false
    loadError = null
  } catch (error) {
    isLoading = false
    loadError = error instanceof Error ? error.message : 'Failed to load Python environment'
    console.error('Failed to initialize Pyodide:', error)
  }
}

export async function executePython(code: string): Promise<CodeExecutionResult> {
  if (!pyodideInstance) {
    return {
      output: '',
      error: 'Python environment is not ready',
      executionTime: 0,
      variables: {}
    }
  }

  const startTime = performance.now()

  try {
    let output = ''

    pyodideInstance.setStdout({
      batched: (text: string) => {
        output += text
      }
    })

    pyodideInstance.runPython(code)

    const variables = pyodideInstance.runPython('dict([(k, repr(v)) for k, v in list(globals().items()) if not k.startswith("__")])')

    return {
      output,
      error: null,
      executionTime: performance.now() - startTime,
      variables
    }
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: performance.now() - startTime,
      variables: {}
    }
  }
}

export async function executeWithTimeout(code: string, timeout: number = 5000): Promise<CodeExecutionResult> {
  return Promise.race([
    executePython(code),
    new Promise<CodeExecutionResult>((resolve) =>
      setTimeout(() => {
        resolve({
          output: '',
          error: 'Code execution timed out. Your code might have an infinite loop!',
          executionTime: timeout,
          variables: {}
        })
      }, timeout)
    )
  ])
}

export function resetEnvironment(): void {
  if (pyodideInstance) {
    try {
      pyodideInstance.runPython('for k in list(globals().keys()):\n    if not k.startswith("__"):\n        del globals()[k]')
    } catch (error) {
      console.error('Failed to reset environment:', error)
    }
  }
}
