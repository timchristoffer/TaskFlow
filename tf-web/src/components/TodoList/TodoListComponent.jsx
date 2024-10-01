import React, { useState, useEffect } from 'react';
import './TodoStyles.css';
import axios from 'axios';

const TodoList = ({id, name, removeTodoList}) => {
  const [todoList, setTodoList] = useState({});
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`https://localhost:7287/todolist/${id}`);
        console.log("Response data:", response.data);
        setTodoList(response.data);
      } catch (error) {
        console.error('Error fetching Todo List:', error);
        alert("Failed to fetch Todo List");
      }
    };
    
    getData();
  }, [id]);

  const createTodo = () => {
    if (!newTodo.trim()) {
      alert('Todo content cannot be empty.');
      return;
    }

    axios.post(`https://localhost:7287/todolist/${id}/todos`, { description: newTodo })
      .then(response => {
        console.log('Created todo:', response.data);
        setTodoList(prevTodoList => ({
        ...prevTodoList,
        todos: [...prevTodoList.todos, response.data]
    }));
    setNewTodo('');
  })
  .catch(error => {
    console.error('Error creating todo:', error);
    alert('Error creating todo. Please try again.');
  });

  };

  const handleCheckboxChange = async (id) => {
    try {
      // Skicka PUT-begäran till backend
      await axios.put(`https://localhost:7287/todolist/${id}/todo/${id}`, {
        isDone: !todoList.todos.find(todo => todo.id === id).isDone
      });
  
      // Uppdatera listan lokalt efter att backend uppdaterats
      const updatedTodos = todoList.todos.map(todo => 
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      );
      setTodoList({ ...todoList, todos: updatedTodos });
    } catch (error) {
      console.error('Error updating Todo status:', error);
      alert("Failed to update Todo status");
    }
  };

  const deleteTodo = (todoId) => {
    axios.delete(`https://localhost:7287/todo/${todoId}`)
      .then(() => {
        setTodoList(prevList => ({
          ...prevList,
          todos: prevList.todos.filter(todo => todo.id !== todoId)
        }));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
        alert('Error deleting todo. Please try again.');
      });
  };
  

  const todos = todoList.todos && todoList.todos.length > 0 ? (
    todoList.todos.map((todo) => (
      <li className='todoItem' key={todo.id} style={{ color: todo.isDone ? 'gray' : 'white' }}>
        <input
          type='checkbox'
          checked={todo.isDone}
          onChange={() => handleCheckboxChange(todo.id)}
        />
        {todo.description}
        <button onClick={() => deleteTodo(todo.id)}>
          <img src="/Icons/Delete.svg" alt="Delete" />
        </button>
      </li>
    ))
  ) : (
    <p>No todos available.</p>
  );

  return (
    <div className="TodoList">
      <h2>{name}</h2>
      <div className="newTodo">
        <textarea
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Write your todo here"
        />
        <button onClick={createTodo}>Add Todo</button>
      </div>
      <ul>
        {todos}
      </ul>
      <div className="notepad-footer">
        <button className="remove-todolist-button" onClick={() => removeTodoList(id)}>Remove Todolist</button>
      </div>
    </div>
    
  );
};

export default TodoList;
