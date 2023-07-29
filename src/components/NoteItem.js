import React, { useContext, useState }  from 'react'
import noteContext from "../context/notes/noteContext";

const NoteItem = (props) => {
  const context = useContext(noteContext);

  const {deleteNote } = context;

  const {note,updateNotes} = props;

  const deleteNoteHandler = () => {
    deleteNote(note._id);
    props.showAlert("Deleted Succesfuuly","success")
  }

  // const editNoteHandler = () => {
  //   editNote(note._id)
  // }

  return (
    <>
     <div className="card mx-3 my-3" style={{width: "18rem"}}>
       <div className="card-body">
       <h5 className="card-title">{note.tag}</h5>
          <div className="d-flex justify-content-md-between">
            <h5 className="card-title">{note.title}</h5>
            <i className="fa-solid fa-pen-to-square" data-bs-target="#editNote" data-bs-toggle="modal" onClick={()=>{updateNotes(note)}}></i>
            {/* <i className="fa-solid fa-pen-to-square" onClick={()=>{updateNotes(note)}}></i> */}
            <i className="fa-solid fa-trash-can"  onClick={deleteNoteHandler} ></i>
          </div>
         <p className="card-text">{note.description}</p>
       </div>
     </div>
   </>

  )
}

export default NoteItem
