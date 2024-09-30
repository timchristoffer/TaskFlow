import React, { useState, useEffect } from 'react';
import TodoStyles from './TodoStyles.css';
import axios from 'axios';

const TodoList = (props) => {
  const [list, setLists] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`https://localhost:7287/todolist/${props.id}`);
        console.log("Response data:", response.data);
        setLists(response.data);
      } catch (error) {
        console.error('Error fetching Todo List:', error);
        alert("Failed to fetch Todo List");
      }
    };
    
    getData();
  }, [props.id]);

  const handleCheckboxChange = async (id) => {
    try {
      // Skicka PUT-begäran till backend
      await axios.put(`https://localhost:7287/todolist/${props.id}/todo/${id}`, {
        isDone: !list.todos.find(todo => todo.id === id).isDone
      });
  
      // Uppdatera listan lokalt efter att backend uppdaterats
      const updatedTodos = list.todos.map(todo => 
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      );
      setLists({ ...list, todos: updatedTodos });
    } catch (error) {
      console.error('Error updating Todo status:', error);
      alert("Failed to update Todo status");
    }
  };
  

  const todos = list.todos && list.todos.length > 0 ? (
    list.todos.map((todo) => (
      <li key={todo.id} style={{ color: todo.isDone ? 'gray' : 'white' }}>
        <input
          type='checkbox'
          checked={todo.isDone}
          onChange={() => handleCheckboxChange(todo.id)}
        />
        {todo.description}
      </li>
    ))
  ) : (
    <p>No todos available.</p>
  );

  return (
    <div className="TodoList">
      <h2>{props.name}</h2>
      <ul>
        {todos}
      </ul>
    </div>
  );
};

export default TodoList;
