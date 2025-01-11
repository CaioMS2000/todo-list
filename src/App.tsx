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
		const todosLeft = todos.filter(todo => todo.id !== id)

		setTodos(todosLeft)

		if (todosLeft.length === 0) {
			// remoção forçada pois em caso de estar vazio, o useEffect não deixa mudar o localStorage
			localStorage.removeItem('todos')
		}
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
		<div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100">
			<div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
				<h1 className="mb-4 text-center font-bold text-2xl">Lista de Tarefas</h1>
				<div className="mb-4 flex">
					<Input
						type="text"
						placeholder="Adicionar nova tarefa"
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
						className="mr-2 flex-grow border-gray-600 bg-gray-700 text-gray-100"
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
							className="flex items-center rounded-lg bg-gray-700 p-3"
						>
							<Checkbox
								checked={todo.completed}
								onCheckedChange={() => toggleTodo(todo.id)}
								className="mr-2"
							/>
							<span
								className={`flex-grow ${todo.completed ? 'text-gray-400 line-through' : ''}`}
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
