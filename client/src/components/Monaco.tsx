'use client'

import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'

interface MonacoEditorProps {
	defaultLanguage?: string
	defaultValue?: string
	height?: string
	width?: string
}

export default function MonacoEditor({
	defaultLanguage = 'javascript',
	defaultValue = '',
	height = '600px',
	width = '100%'
}: MonacoEditorProps = {}) {
	const [value, setValue] = useState(defaultValue)
	const [output, setOutput] = useState('')
	const outputRef = useRef<HTMLPreElement>(null)

	const handleEditorChange = (value: string | undefined) => {
		setValue(value || '')
	}

	const executeCode = () => {
		setOutput('')
		const originalConsoleLog = console.log
		const originalConsoleError = console.error

		try {
			console.log = (...args) => {
				setOutput(prev => prev + args.join(' ') + '\n')
				originalConsoleLog(...args)
			}
			console.error = (...args) => {
				setOutput(prev => prev + 'Error: ' + args.join(' ') + '\n')
				originalConsoleError(...args)
			}
			eval(value)
		} catch (error) {
			setOutput(`Error: ${error}\n`)
		} finally {
			console.log = originalConsoleLog
			console.error = originalConsoleError
		}

		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-4 flex flex-row w-full max-h-screen">
			<div className="border border-gray-300 rounded-lg max-h-screen overflow-hidden w-3/5">
				<Editor
					height={height}
					width={width}
					language={defaultLanguage}
					value={value}
					onChange={handleEditorChange}
					
					theme="vs-dark"
					options={{
						wordWrap: 'on',
						minimap: { enabled: false },
						scrollBeyondLastLine: false,
						fontSize: 14,
						padding: {
							top: 12,
							bottom: 12
						}
					}}
				/>
			</div>

			<div className='ml-4 w-2/5'>
				<button
					onClick={executeCode}
					className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors px-6 py-2 mb-4"
				>
					Run
				</button>
				<div className="bg-gray-100 rounded-lg">
					<h3 className="text-lg font-semibold mb-2 px-2">Output:</h3>
					<pre
						style={{ maxHeight: '510px'}}
						ref={outputRef}
						className="whitespace-pre-wrap overflow-x-hidden break-words overflow-y-auto bg-white p-2 rounded border border-gray-300"
					>
						{output}
					</pre>
				</div>
			</div>

		</div>
	)
}
