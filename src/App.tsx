import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './App.css';

type Todo = { id: number; text: string; completed: boolean; dueDate?: string };

const FILTERS = {
    all: (todo: Todo) => true,
    active: (todo: Todo) => !todo.completed,
    completed: (todo: Todo) => todo.completed,
};

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [search, setSearch] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const addTodo = () => {
        if (inputValue.trim()) {
            const newTodo = {
                id: Date.now(),
                text: inputValue,
                completed: false,
                dueDate: dueDate || undefined,
            };
            setTodos([...todos, newTodo]);
            setInputValue('');
            setDueDate('');
            setNotification('Todo added!');
        }
    };

    const removeTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
        setNotification('Todo deleted!');
    };

    const toggleTodo = (id: number) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
        setNotification('Todo updated!');
    };

    const editTodo = (id: number, text: string) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, text } : todo
            )
        );
        setNotification('Todo edited!');
    };

    const editDueDate = (id: number, dueDate: string) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, dueDate } : todo
            )
        );
        setNotification('Due date updated!');
    };

    const markAllCompleted = () => {
        setTodos(todos.map(todo => ({ ...todo, completed: true })));
        setNotification('All marked as completed!');
    };

    const deleteCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
        setNotification('Completed todos deleted!');
    };

    // Drag and drop handler
    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTodos(items);
    };

    // Filter and search
    const filteredTodos = todos
        .filter(FILTERS[filter])
        .filter(todo => todo.text.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="container">
                <h1>To-Do List</h1>
                <button onClick={() => setDarkMode(dm => !dm)}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add a new todo"
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />
                    <button onClick={addTodo}>Add Todo</button>
                </div>
                <div>
                    <button onClick={() => setFilter('all')}>All</button>
                    <button onClick={() => setFilter('active')}>Active</button>
                    <button onClick={() => setFilter('completed')}>Completed</button>
                </div>
                <div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search todos"
                    />
                </div>
                <div>
                    <button onClick={markAllCompleted}>Mark All Completed</button>
                    <button onClick={deleteCompleted}>Delete Completed</button>
                </div>
                {notification && <div className="notification">{notification}</div>}
                <TodoList
                    todos={filteredTodos}
                    onToggle={toggleTodo}
                    onDelete={removeTodo}
                    onEdit={editTodo}
                    onEditDueDate={editDueDate}
                    onDragEnd={onDragEnd}
                />
            </div>
        </div>
    );
};

export default App;