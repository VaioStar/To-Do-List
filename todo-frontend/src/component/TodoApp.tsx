import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import '../styles/TodoApp.css';

interface Todo {
    id: number;
    name: string;
    dueDate: string;
    completionDate?: string;
    completed: boolean;
    isEditing?: boolean;
}

const TodoApp: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoName, setNewTodoName] = useState<string>('');
    const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');
    const [newTodoCompletionDate, setNewTodoCompletionDate] = useState<string>('');
    const [newTodoCompleted, setNewTodoCompleted] = useState<boolean>(false);
    const [showCompleted, setShowCompleted] = useState<boolean>(false);

    const fetchTodos = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3000/todos', {
                params: { showCompleted },
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }, [showCompleted]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const filteredTodos = useMemo(() => {
        return todos.filter(todo => (showCompleted ? true : !todo.completed));
    }, [todos, showCompleted]);

    const handleCreateTodo = async () => {
        if (!newTodoName) {
            alert('Todo name is required');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/todos', {
                name: newTodoName,
                dueDate: newTodoDueDate,
                completionDate: newTodoCompleted ? newTodoCompletionDate : undefined,
                completed: newTodoCompleted,
            });
            setTodos((prevTodos) => [...prevTodos, response.data]);
            setNewTodoName('');
            setNewTodoDueDate('');
            setNewTodoCompletionDate('');
            setNewTodoCompleted(false);
        } catch (error) {
            alert('Error creating todo');
        }
    };

    const handleCompleteTodo = async (id: number) => {
        try {
            await axios.patch(`http://localhost:3000/todos/${id}/complete`);
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id ? { ...todo, completed: true } : todo
                )
            );
        } catch (error) {
            alert('Error completing todo');
        }
    };

    const handleDeleteTodo = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/todos/${id}`);
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } catch (error) {
            alert('Error deleting todo');
        }
    };

    const handleToggleShowCompleted = () => {
        setShowCompleted((prev) => !prev);
    };

    const toggleCompletedStatus = () => {
        setNewTodoCompleted((prev) => !prev);
    };

    const handleEditTodo = (todo: Todo) => {
        const updatedTodos = todos.map((item) =>
            item.id === todo.id
                ? { ...item, isEditing: true }
                : item
        );
        setTodos(updatedTodos);
    };

    const handleUpdateTodo = async (todo: Todo) => {
        try {
            const response = await axios.patch(`http://localhost:3000/todos/${todo.id}`, {
                name: todo.name,
                dueDate: todo.dueDate,
                completionDate: todo.completed ? todo.completionDate : undefined,
                completed: todo.completed,
            });

            const updatedTodos = todos.map((item) =>
                item.id === todo.id ? { ...item, ...response.data, isEditing: false } : item
            );
            setTodos(updatedTodos);
        } catch (error) {
            alert('Error updating todo');
        }
    };

    const handleCancelEdit = (todo: Todo) => {
        const updatedTodos = todos.map((item) =>
            item.id === todo.id
                ? { ...item, isEditing: false }
                : item
        );
        setTodos(updatedTodos);
    };

    return (
        <div className="app-container">
            <h1>Todo List</h1>

            {/* Task form */}
            <div className="card">
                <h2>Add New Todo</h2>
                <input
                    type="text"
                    value={newTodoName}
                    onChange={(e) => setNewTodoName(e.target.value)}
                    placeholder="Enter todo name"
                />
                <input
                    type="date"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                    placeholder="Due date"
                />
                <input
                    type="date"
                    value={newTodoCompletionDate}
                    onChange={(e) => setNewTodoCompletionDate(e.target.value)}
                    placeholder="Completion date (optional)"
                    disabled={!newTodoCompleted}
                />
                <div className="button-container">
                    <button
                        onClick={toggleCompletedStatus}
                        className={newTodoCompleted ? 'completed-btn' : 'not-completed-btn'}
                    >
                        {newTodoCompleted ? 'Completed' : 'Mark as Completed'}
                    </button>
                </div>
                <button onClick={handleCreateTodo}>Add Todo</button>
            </div>

            {/* Toggle show/hide completed tasks */}
            <button onClick={handleToggleShowCompleted}>
                {showCompleted ? 'Hide' : 'Show'} Completed
            </button>

            {/* Task table */}
            <table className="todo-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Due Date</th>
                    <th>Completion Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredTodos.map((todo) => (
                    <tr key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <td>
                            {!todo.isEditing ? (
                                todo.name
                            ) : (
                                <input
                                    type="text"
                                    value={todo.name}
                                    onChange={(e) =>
                                        setTodos((prevTodos) =>
                                            prevTodos.map((item) =>
                                                item.id === todo.id
                                                    ? { ...item, name: e.target.value }
                                                    : item
                                            )
                                        )
                                    }
                                />
                            )}
                        </td>
                        <td>
                            {!todo.isEditing ? (
                                todo.dueDate
                            ) : (
                                <input
                                    type="date"
                                    value={todo.dueDate}
                                    onChange={(e) =>
                                        setTodos((prevTodos) =>
                                            prevTodos.map((item) =>
                                                item.id === todo.id
                                                    ? { ...item, dueDate: e.target.value }
                                                    : item
                                            )
                                        )
                                    }
                                />
                            )}
                        </td>
                        <td>
                            {!todo.isEditing ? (
                                todo.completed && todo.completionDate
                            ) : (
                                <input
                                    type="date"
                                    value={todo.completionDate || ''}
                                    onChange={(e) =>
                                        setTodos((prevTodos) =>
                                            prevTodos.map((item) =>
                                                item.id === todo.id
                                                    ? { ...item, completionDate: e.target.value }
                                                    : item
                                            )
                                        )
                                    }
                                />
                            )}
                        </td>
                        <td>
                            {!todo.isEditing ? (
                                <>
                                    {!todo.completed && (
                                        <button onClick={() => handleCompleteTodo(todo.id)}>
                                            Complete
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteTodo(todo.id)}>
                                        Delete
                                    </button>
                                    {!todo.completed && (
                                        <button onClick={() => handleEditTodo(todo)}>Edit</button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleUpdateTodo(todo)}>Save</button>
                                    <button onClick={() => handleCancelEdit(todo)}>Cancel</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TodoApp;
