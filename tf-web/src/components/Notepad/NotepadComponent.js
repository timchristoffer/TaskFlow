import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notepad.css'; // Importera CSS-filen

const NotepadComponent = ({ notepadId, removeNotepad }) => {
  const [notepad, setNotepad] = useState(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newNotepadName, setNewNotepadName] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  useEffect(() => {
    const fetchNotepad = async () => {
      try {
        console.log(`Fetching notepad with ID: ${notepadId}`);
        const response = await axios.get(`https://localhost:7287/notepads/${notepadId}`);
        console.log('Fetched notepad:', response.data);
        setNotepad(response.data);
        setNewNotepadName(response.data.name);
      } catch (error) {
        console.error('Error fetching notepad:', error);
        alert('Failed to fetch notepad');
      }
    };

    fetchNotepad();
  }, [notepadId]);

  const createNote = () => {
    if (!newNoteContent.trim()) {
      alert('Note content cannot be empty.');
      return;
    }

    axios.post(`https://localhost:7287/notepads/${notepadId}/notes`, { text: newNoteContent })
      .then(response => {
        console.log('Created note:', response.data);
        setNotepad(prevNotepad => ({
          ...prevNotepad,
          notes: [...prevNotepad.notes, response.data]
        }));
        setNewNoteContent('');
      })
      .catch(error => {
        console.error('Error creating note:', error);
        alert('Error creating note. Please try again.');
      });
  };

  const handleNameChange = () => {
    if (!newNotepadName.trim()) {
      alert('Notepad name cannot be empty.');
      return;
    }

    axios.put(`https://localhost:7287/notepads/${notepadId}`, { name: newNotepadName })
      .then(() => {
        console.log('Updated notepad name:', newNotepadName);
        setNotepad(prevNotepad => ({
          ...prevNotepad,
          name: newNotepadName
        }));
        setIsEditingName(false);
      })
      .catch(error => {
        console.error('Error updating notepad name:', error);
        alert('Error updating notepad name. Please try again.');
      });
  };

  const deleteNote = (noteId) => {
    axios.delete(`https://localhost:7287/notepads/${notepadId}/notes/${noteId}`)
      .then(() => {
        setNotepad(prevNotepad => ({
          ...prevNotepad,
          notes: prevNotepad.notes.filter(note => note.id !== noteId)
        }));
      })
      .catch(error => {
        console.error('Error deleting note:', error);
        alert('Error deleting note. Please try again.');
      });
  };

  const startEditingNote = (note) => {
    if (note && note.id) {
      setEditingNoteId(note.id);
      setEditingNoteContent(note.text);
    } else {
      console.error('Invalid note object:', note);
    }
  };

  const saveNoteEdit = () => {
    if (!editingNoteContent.trim()) {
      alert('Note content cannot be empty.');
      return;
    }

    console.log(`Updating note with ID: ${editingNoteId}`);
    console.log(`New note content: ${editingNoteContent}`);

    axios.put(`https://localhost:7287/notepads/${notepadId}/notes/${editingNoteId}`, { text: editingNoteContent })
      .then(response => {
        console.log('Updated note:', response.data);

        setNotepad(prevNotepad => ({
          ...prevNotepad,
          notes: prevNotepad.notes.map(note => 
            note.id === editingNoteId ? { ...note, text: editingNoteContent } : note
          )
        }));

        setEditingNoteId(null);
        setEditingNoteContent('');
      })
      .catch(error => {
        console.error('Error updating note:', error);
        alert('Error updating note. Please try again.');
      });
  };

  return (
    <div className="notepad-widget">
      {isEditingName ? (
        <div className="notepad-name-edit">
          <input
            type="text"
            value={newNotepadName}
            onChange={(e) => setNewNotepadName(e.target.value)}
            onBlur={handleNameChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleNameChange();
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <h2 className="notepad-name" onClick={() => setIsEditingName(true)}>{notepad ? notepad.name : 'Loading...'}</h2>
      )}
      <div className="notepad-notes">
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Write your note here"
        />
        <button onClick={createNote}>Add Note</button>
      </div>
      <div className="notepad-notes-list">
        <h3>Notes</h3>
        {notepad && notepad.notes && notepad.notes.map(note => (
          <div key={note.id} className="note">
            {editingNoteId === note.id ? (
              <div>
                <textarea
                  value={editingNoteContent}
                  onChange={(e) => setEditingNoteContent(e.target.value)}
                />
                <div className="edit-actions">
                  <button onClick={saveNoteEdit}>Save</button>
                  <button onClick={() => setEditingNoteId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className='note-container'>
                <p>{note.text}</p>
                <div className="note-actions">
                  <button onClick={() => startEditingNote(note)}>
                    <img src="/Icons/Edit.svg" alt="Edit" />
                  </button>
                  <button onClick={() => deleteNote(note.id)}>
                    <img src="/Icons/Delete.svg" alt="Delete" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="notepad-footer">
        <button className="remove-notepad-button" onClick={() => removeNotepad(notepadId)}>Remove Notepad</button>
      </div>
    </div>
  );
};

export default NotepadComponent;