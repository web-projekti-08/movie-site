/*
  LUODUT RYHMÄT KOMPONENTTI
*/

import React from "react";
import { useNavigate } from "react-router-dom";

export default function CreatedGroupsList({ groups, onDelete }) {
  const navigate = useNavigate();

  return (
    <>
      <h4 className="mt-4">Created groups</h4>
      <div className="mt-4 card-group">
        {groups.map(group => (
          <div
            className="card small-card"
            key={group.group_id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/groups/${group.group_id}`)}
          >
            <img src="/placeholder.png" className="card-img-top" alt="" />
            <div className="card-body">
              <h5>{group.group_name}</h5>
              <p>{group.description}</p>
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  onDelete(group.group_id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
