import React, { useContext, useState } from 'react'
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({title: "", description: "", tag: ""})

  const addNoteHandler = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({title: "", description: "", tag: ""})
    props.showAlert("Added Succesfuuly","success")
  }

  const onChange = (e) => {
    setNote({...note, [e.target.name]: e.target.value})
  }
  return (
    <div className="container">
      <h1>Add a Note</h1>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" name="title" id="title" aria-describedby="emailHelp" onChange={onChange} value={note.title} required />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" name="tag" id="tag" aria-describedby="emailHelp" onChange={onChange} value={note.tag} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control" id="description"  name="description" rows="8" onChange={onChange} value={note.description} required ></textarea>
        </div>
        <button disabled={note.title.length<5 || note.description.length<5 } type="submit" className="btn btn-primary" onClick={addNoteHandler}>Add Note</button>
      </form>
    </div>
  )
}

export default AddNote
