import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'

interface Todo {
	id: string
	text: string
	completed: boolean
}

export default function TodoList() {
	const [todos, setTodos] = useState<Todo[]>([])
	const [inputValue, setInputValue] = useState('')

	const addTodo = () => {
		if (inputValue.trim() !== '') {
			const newTodoItem: Todo = {
				id: crypto.randomUUID().toString(),
				text: inputValue,
				completed: false,
			}

			setTodos([...todos, newTodoItem])
			setInputValue('')
		}
	}

	const toggleTodo = (id: string) => {
		setTodos(
			todos.map(todo =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		)
	}

	const removeTodo = (id: string) => {
		setTodos(todos.filter(todo => todo.id !== id))
	}

	useEffect(() => {
		if (todos.length > 0) {
			localStorage.setItem('todos', JSON.stringify(todos))
		}
	}, [todos])

	useEffect(() => {
		const storedTodos = localStorage.getItem('todos')

		if (storedTodos) {
			setTodos(JSON.parse(storedTodos))
		}
	}, [])

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
			<div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
				<h1 className="text-2xl font-bold mb-4 text-center">Lista de Tarefas</h1>
				<div className="flex mb-4">
					<Input
						type="text"
						placeholder="Adicionar nova tarefa"
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
						className="flex-grow mr-2 bg-gray-700 text-gray-100 border-gray-600"
						onKeyPress={e => e.key === 'Enter' && addTodo()}
					/>
					<Button onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">
						Adicionar
					</Button>
				</div>
				<ul className="space-y-2">
					{todos.map(todo => (
						<li
							key={todo.id}
							className="flex items-center bg-gray-700 p-3 rounded-lg"
						>
							<Checkbox
								checked={todo.completed}
								onCheckedChange={() => toggleTodo(todo.id)}
								className="mr-2"
							/>
							<span
								className={`flex-grow ${todo.completed ? 'line-through text-gray-400' : ''}`}
							>
								{todo.text}
							</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => removeTodo(todo.id)}
								className="text-gray-400 hover:text-red-500"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
