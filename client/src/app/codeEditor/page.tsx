import MonacoEditor from '@/components/Monaco'

export default function Home() {
	return (
		<MonacoEditor
			defaultLanguage="javascript"
			defaultValue={
				`function fibonacci(n) {
  let sequence = [0, 1];

  if (n === 0) return [0];
  if (n === 1) return sequence;

  for (let i = 2; i <= n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
	
  return sequence;
}
	
console.log(fibonacci(10));`
			}
		/>
	)
}
