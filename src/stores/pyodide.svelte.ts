import type { CodeExecutionResult } from '$lib/types.ts'

let pyodideInstance: any = null
let isLoading = $state(true)
let loadError = $state<string | null>(null)

export function isPyodideLoading() {
  return isLoading
}

export function getPyodideLoadError() {
  return loadError
}

export function getPyodideInstance() {
  return pyodideInstance
}

async function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('🐍 [SCRIPT] Loading Pyodide CDN script...')
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
    script.async = true
    script.onload = () => {
      console.log('🐍 [SCRIPT] ✅ Pyodide script loaded successfully')
      resolve()
    }
    script.onerror = (error) => {
      console.error('🐍 [SCRIPT] ❌ Failed to load script:', error)
      reject(new Error('Failed to load Pyodide CDN script'))
    }
    document.head.appendChild(script)
  })
}

export async function initPyodide(): Promise<void> {
  if (pyodideInstance) {
    console.log('🐍 Pyodide already initialized, skipping')
    return
  }

  console.log('🐍 [1/4] Starting Pyodide initialization...')
  
  try {
    // Load the script first
    if (typeof (window as any).loadPyodide === 'undefined') {
      console.log('🐍 [2/4] loadPyodide not found, loading script...')
      await loadPyodideScript()
    } else {
      console.log('🐍 [2/4] loadPyodide already available')
    }
    
    // Double-check it loaded
    if (typeof (window as any).loadPyodide === 'undefined') {
      throw new Error('loadPyodide function not available after script load')
    }

    console.log('🐍 [3/4] Calling loadPyodide() with minimal config...')
    
    // Absolute minimal configuration - no options at all
    const pyodide = await (window as any).loadPyodide()
    
    console.log('🐍 [4/4] loadPyodide() returned successfully!')

    pyodideInstance = pyodide
    isLoading = false
    loadError = null
    console.log('🐍 ✅ Pyodide fully initialized and ready!')
  } catch (error) {
    isLoading = false
    loadError = error instanceof Error ? error.message : 'Failed to load Python environment'
    console.error('🐍 ❌ Failed to initialize Pyodide:', error)
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
