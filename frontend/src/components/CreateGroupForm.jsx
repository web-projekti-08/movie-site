/*  
  RYHMÄN LUONTI LOMAKE KOMPONENTTI
*/

import React, { useState } from "react";

export default function CreateGroupForm({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <form className="card p-4 mt-2" onSubmit={(e) => {
      e.preventDefault();
      onCreate(name, desc);
      setName("");
      setDesc("");
      onClose();
    }}>
      <button type="button" className="btn-close" onClick={onClose}></button>

      <input
        className="form-control mb-2"
        placeholder="Group name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />

      <button className="btn btn-success">Create</button>
    </form>
  );
}
