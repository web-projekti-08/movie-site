import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import { getGroups, getGroupMembers, removeMember } from '../services/groupsService'

export default function GroupDetails() {

const {groupId} = useParams()
const [group, setGroup] = useState(null)
const [members, setMembers] = useState([])

useEffect(() => {
  async function loadData() {
    const allGroups = await getGroups()
    const found = allGroups.find (g => g.group_id === Number(groupId))
    setGroup(found)

    const memberList = await getGroupMembers(Number(groupId))
    setMembers(memberList)
  }

  loadData()
}, [groupId])

async function handleRemoveMember(userId) {
  await removeMember(Numbre(groupId), userId)
  const updated = await getGroupMembers(Number(groupId))
  setMembers(updated)
  
}

if(!group) return <p>Loading group...</p>


  return (
    <>
    <div className="container mt-4">
      <Link to="/groups" className="btn btn-secondary btn-sm mb-3">Back</Link>

      <h2>{group.group_name}</h2>
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

