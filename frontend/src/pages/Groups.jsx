import React, { useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import '../App.css'
import { getGroups, createGroup, deleteGroup, getGroupMembers, removeMember,
  getRequests, acceptRequest, rejectRequest
} from '../services/groupsService'


export default function Groups() {

  const [groups, setGroups] = useState([])
  const [members, setMembers] = useState({})
  const [requests, setRequests] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [otherGroups, setOtherGroups] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 5
  const visibleGroups = otherGroups.slice(currentIndex, currentIndex + itemsPerPage)
  const [createdIndex, setCreatedIndex] = useState(0)
  const createdItemsPerPage = 5
  const visibleCreatedGroups = groups.slice(createdIndex, createdIndex + createdItemsPerPage)

  
function handleNext() {
  if (currentIndex + itemsPerPage < otherGroups.length) {
    setCurrentIndex(currentIndex + itemsPerPage);
  }
}

function handlePrev() {
  if (currentIndex - itemsPerPage >= 0) {
    setCurrentIndex(currentIndex - itemsPerPage);
  }
}

function handleCreatedNext() {
  if (createdIndex + createdItemsPerPage < groups.length) {
    setCreatedIndex(createdIndex + createdItemsPerPage);
  }
}

function handleCreatedPrev() {
  if (createdIndex - createdItemsPerPage >= 0) {
    setCreatedIndex(createdIndex - createdItemsPerPage);
  }
}

  // luo ryhmä

  async function handleCreateGroupForm() {
    if (!newGroupName) return;

    try {
      const userId = 1
      await createGroup({ userId, groupName: newGroupName, description: newGroupDescription });
      setNewGroupName("");
      setNewGroupDescription("");
      setShowCreateForm(false);
      await loadGroups();
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  }

  // poista ryhmä

  async function handleDeleteGroup(groupId) {

    const confirmed = window.confirm("Continuing will delete the group, are you sure?")
    if (!confirmed) return

    try {
      await deleteGroup(groupId)
      await loadGroups()
    } catch (err) {
      console.error("Failed to delete group: ", err.response?.data || err)
    }
  }

  // lataa ryhmät ja jäsenet


  async function loadGroups() {
    const data = await getGroups()
    setGroups(data)

    const memberData = {}
    for (const g of data) {
      try {
        memberData[g.group_id] = await getGroupMembers(g.group_id)
      } catch (e) {
        memberData[g.group_id] = []
      }
    }

    setMembers(memberData)

  }

  // liittymispyynnöt 

  async function loadRequests() {
    const allRequests = []
    for (const g of groups) {
      try {
        const reqs = await getRequests(g.group_id)
        reqs.forEach(r => allRequests.push({ ...r, groupName: g.group_name, groupId: g.group_id }))
      } catch { }
    }
    setRequests(allRequests)
  }

  // jäsenen poisto ryhmästä

  async function handleRemoveMember(groupId, userId) {
    await removeMember(groupId, userId)
    loadGroups()
  }

  // hyväksy tai hylkää pyyntö

  async function handleAccept(groupId, userId) {
    await acceptRequest(groupId, userId)
    loadRequests()
  }

  async function handleReject(groupId, userId) {
    await rejectRequest(groupId, userId)
    loadRequests()
  }

  // muiden käyttäjien tekemät ryhmät 

  async function loadOtherGroups() {
    const allGroups = await getGroups()
    const myGroupsIds = groups.map(g => g.group_id)
    const others = allGroups.filter(g => !myGroupsIds.includes(g.group_id))
    setOtherGroups(others)
  }


// HOOKIT

  useEffect(() => {
    async function fetchGroups() {
      await loadGroups()
    }
    fetchGroups()
  }, [])

  
/* VÄLIAIKAISESTI 

useEffect(() => {
    if (groups.length > 0) {
      loadRequests()
      loadOtherGroups() 
    }
  }, [groups]) */ 

// Mock-data front-end testaukseen

useEffect(() => {
  setRequests([
    { user_id: 2, groupId: 1, groupName: "Movie Maniacs" },
    { user_id: 3, groupId: 2, groupName: "Sci-Fi Sundays" },
    { user_id: 4, groupId: 3, groupName: "Indie Lovers" },
    { user_id: 5, groupId: 1, groupName: "Movie Maniacs" },
    { user_id: 6, groupId: 2, groupName: "Sci-Fi Sundays" },
    { user_id: 7, groupId: 3, groupName: "Indie Lovers" },
  ])
}, [])


  // testaan mockdatalla tehdä ryhmiä jotka näkyy sivulla 

  useEffect(() => {
  if (otherGroups.length === 0) {
    setOtherGroups([
      { group_id: 101, group_name: "Test Group 1", description: "Example description" },
      { group_id: 102, group_name: "Test Group 2", description: "Example description 2" },
      { group_id: 103, group_name: "Test Group 3", description: "Example description 3" },
      { group_id: 104, group_name: "Test Group 4", description: "Example description 4" },
      { group_id: 105, group_name: "Test Group 5", description: "Example description 5" },
      { group_id: 106, group_name: "Test Group 6", description: "Example description 6" },
      { group_id: 107, group_name: "Test Group 7", description: "Example description 7" },
      { group_id: 108, group_name: "Test Group 8", description: "Example description 8" },
      { group_id: 109, group_name: "Test Group 9", description: "Example description 9" },
    ])
  }
}, [otherGroups])


  return (
  <>
    <h4 className="mt-4">Join group</h4>
    <div className="mt-4 join-groups-wrapper">
      {otherGroups.slice(currentIndex, currentIndex + itemsPerPage).map(group => (
        <div className="card small-card d-flex flex-column" key={group.group_id}>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic1.srcdn.com%2Fwordpress%2Fwp-content%2Fuploads%2F2023%2F10%2Fwonka-movie-poster.jpg&f=1&nofb=1&ipt=652c92bc149bd2a0fb8490e352bb8bcc434a06ae04847d631c2f039f8953792c"
            className="card-img-top"
            alt="Group"
          />
          <div className="card-body d-flex flex-column flex-grow-1">
            <Link to={`/groups/${group.group_id}`} className="text-decoration-none">
              <h5 className="card-title">{group.group_name}</h5>
            </Link>
            <p className="card-text">{group.description}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="d-flex justify-content-between mt-2">
      <button 
        className="btn btn-secondary" 
        onClick={() => setCurrentIndex(prev => Math.max(prev - itemsPerPage, 0))}
        disabled={currentIndex === 0}
      >
        Prev
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={() => setCurrentIndex(prev => Math.min(prev + itemsPerPage, otherGroups.length - itemsPerPage))}
        disabled={currentIndex + itemsPerPage >= otherGroups.length}
      >
        Next
      </button>
    </div>

    <h4 className="mt-4">Created groups</h4>
    <div className="mt-4 card-group">
      {visibleCreatedGroups.map(group => (
        <div className="card small-card d-flex flex-column" key={group.group_id}>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-psd%2Fmovie-poster_841014-31866.jpg%3Fw%3D2000&f=1&nofb=1&ipt=bdc0a506339540d66a5305bb97d666be4ecdaae9537f1cd721bc1bc3a28f0d35"
            className="card-img-top"
            alt="Group"
          />
          <div className="card-body d-flex flex-column flex-grow-1">
            <Link to={`/groups/${group.group_id}`} className="text-decoration-none">
              <h5 className="card-title">{group.group_name}</h5>
            </Link>
            <p className="card-text">{group.description}</p>

            <div className="d-flex justify-content-between mt-auto">
              <div className="dropdown">
                <button
                  className="btn btn-warning dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Members
                </button>
                <ul className="dropdown-menu wide-dropdown">
                  {(members[group.group_id] || []).map(m => (
                    <li
                      className="d-flex justify-content-between align-items-center"
                      key={m.user_id}
                    >
                      <span>{m.user_id}</span>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveMember(group.group_id, m.user_id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleDeleteGroup(group.group_id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="d-flex justify-content-between mt-2">
      <button 
        className="btn btn-secondary" 
        onClick={handleCreatedPrev}
        disabled={createdIndex === 0}
      >
        Prev
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={handleCreatedNext}
        disabled={createdIndex + createdItemsPerPage >= groups.length}
      >
        Next
      </button>
    </div>

    <button
      type="button"
      className="btn btn-primary btn-sm mt-4"
      onClick={() => setShowCreateForm(true)}
    >
      Create new group
    </button>

    {showCreateForm && (
      <div className="mt-2 card p-5">
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
          onClick={() => setShowCreateForm(false)}
        ></button>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Group Name"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Group Description"
          value={newGroupDescription}
          onChange={e => setNewGroupDescription(e.target.value)}
        />
        <button className="btn btn-success btn-sm" onClick={handleCreateGroupForm}>
          Create
        </button>
      </div>
    )}

      <h4 className="mt-4">Pending requests</h4>
      {requests.map(r => (
        <div key={`${r.groupId}-${r.user_id}`} className="d-flex justify-content-between align-items-center mb-1">
          <span>@{r.user_id} wants to join {r.groupName}</span>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-success btn-sm mb-1 me-2"
              onClick={() => handleAccept(r.groupId, r.user_id)}>Accept</button>
            <button
              type="button"
              className="btn btn-danger btn-sm ms-2 mb-1"
              onClick={() => handleReject(r.groupId, r.user_id)}>Reject</button>
          </div>
        </div>
    ))}
    <h4 className="mt-4">Joined groups</h4>
  </>
)
}
