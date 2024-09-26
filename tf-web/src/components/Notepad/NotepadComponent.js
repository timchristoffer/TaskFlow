import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotepadComponent = ({ dashboardId, notepads, setNotepads }) => {
  const [selectedNotepadId, setSelectedNotepadId] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const createNote = () => {
    if (!selectedNotepadId) {
      alert('Please select a notepad first.');
      return;
    }

    if (!newNoteContent.trim()) {
      alert('Note content cannot be empty.');
      return;
    }

    axios.post(`https://localhost:7287/dashboards/${dashboardId}/notepads/${selectedNotepadId}/notes`, { text: newNoteContent })
      .then(response => {
        const updatedNotepads = notepads.map(notepad => {
          if (notepad.id === parseInt(selectedNotepadId)) {
            return { ...notepad, notes: [...notepad.notes, response.data] };
          }
          return notepad;
        });
        setNotepads(updatedNotepads);
        setNewNoteContent('');
      })
      .catch(error => {
        console.error('Error creating note:', error);
        alert('Error creating note. Please try again.');
      });
  };

  return (
    <div className="notepad-widget">
      <h2>Notepads</h2>
      <div>
        <h3>Select Notepad</h3>
        <select onChange={(e) => setSelectedNotepadId(e.target.value)} value={selectedNotepadId || ''}>
          <option value="">Select a notepad</option>
          {Array.isArray(notepads) && notepads.map(notepad => (
            <option key={notepad.id} value={notepad.id}>{notepad.name}</option>
          ))}
        </select>
      </div>
      <div>
        <h3>Notes</h3>
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Write your note here"
        />
        <button onClick={createNote}>Add Note</button>
      </div>
      <div>
        {Array.isArray(notepads) && notepads.map(notepad => (
          <div key={notepad.id}>
            <h4>{notepad.name}</h4>
            <ul>
              {notepad.notes && notepad.notes.map(note => (
                <li key={note.id}>{note.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotepadComponent;