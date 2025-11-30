import React, {useEffect, useState} from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom'
import { getGroups, getGroupMembers, removeMember, deleteGroup } from '../services/groupsService'

export default function GroupDetails() {

const {groupId} = useParams()
const [group, setGroup] = useState(null)
const [members, setMembers] = useState([])
const navigate = useNavigate()

async function handleDeleteGroup() {
  const confirmed = window.confirm("Confirm deletion")
  if (!confirmed) return

  await deleteGroup(Number(groupId))
  navigate("/groups")
}

useEffect(() => {
  async function loadData() {
    try {
    const allGroups = await getGroups()
    const found = allGroups.find (g => g.group_id === Number(groupId))
    if (!found) {
      setGroup(null)
      return
    }

    setGroup(found)

    try {
      const memberList = await getGroupMembers(Number(groupId))
    setMembers(memberList)
    } catch (err) {
      console.warn("Failed to load members")
      setMembers([])
    }
  } catch (err) {
    console.error("Failed to load group", err)
    setGroup(null)
  }
}
  
  loadData()
}, [groupId])

async function handleRemoveMember(userId) {
  await removeMember(Number(groupId), userId)
  const updated = await getGroupMembers(Number(groupId))
  setMembers(updated)
  
}

if(group === null) return <p>Could not load group or it does not exist.</p>


  return (
    <>
    <div className="container mt-4">
      <Link to="/groups" className="btn btn-secondary btn-sm mb-3">Back</Link>

      <h2>{group.group_name}</h2>
      <button 
          className="btn btn-danger btn-sm mt-2 mb-3"
          onClick={handleDeleteGroup}
          >Delete group</button>
      <p>{group.description}</p>

      <h4 className="mt-4">Members</h4>
      {members.length === 0 && <p>No members in this group yet.</p>}

      <ul className="list-group">
        {members.map(m=> (
          <li
            key={m.user_id}
            className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>User ID: {m.user_id}</span>
              <button
                className="btn-btn-danger btn-sm"
                onClick={() => handleRemoveMember(m.user_id)}
                >
                  Remove
                </button>
            </li>
        ))}
      </ul>
    </div>
    </>
  )
}

