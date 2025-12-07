import React from 'react'

export default function Notifications() {
  return (
    <>
      <div className="d-flex align-items-center">
        <h4>Notifications</h4>
        <button type="button" class="btn btn-primary position-relative ms-3">
          Inbox
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
            <span className="visually-hidden">unread messages</span>
          </span>
        </button>
      </div>
      <ul class="list-group mt-5">
        <li class="list-group-item d-flex justify-content-between align-items-center">
          @username has asked to join *groupname
          <span class="badge text-bg-primary rounded-pill">1</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          You have been accepted into *groupname
          <span class="badge text-bg-primary rounded-pill">1</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          @username has asked to join *groupname
          <span class="badge text-bg-primary rounded-pill">1</span>
        </li>
      </ul>
    </>
  )
}