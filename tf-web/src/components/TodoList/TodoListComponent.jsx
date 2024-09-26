import React from 'react'
import TodoStyles from  './TodoStyles.css'
import axios from 'axios'


const TodoList = (props) => {

  const [list, setLists] = React.useState({ });

  React.useEffect(() => {
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
  }, []); // Tom array betyder att effekten körs en gång vid mount
  
  // Kontrollera om todos finns och rendera dem
  const todos = list.todos && list.todos.length > 0 ? list.todos.map((todo, id) => (
     <li key={id}><input type='checkbox'/>{todo.description}</li>
  )) : <p>No todos available.</p>;
  
  return (
    <div className="TodoList">
      <h2>{props.name}</h2>
      <ul>
        {todos}
      </ul>
    </div>
  );
  
}

export default TodoList
