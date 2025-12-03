import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
  getGroups,
  createGroup,
  deleteGroup,
  getGroupMembers,
  removeMember,
  getRequests,
  acceptRequest,
  rejectRequest
} from '../services/groupsService';

const API_BASE=process.env.REACT_APP_API_URL

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState({});
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [otherGroups, setOtherGroups] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;
  const visibleGroups = otherGroups.slice(currentIndex, currentIndex + itemsPerPage);

  const [createdIndex, setCreatedIndex] = useState(0);
  const createdItemsPerPage = 5;
  const visibleCreatedGroups = groups.slice(createdIndex, createdIndex + createdItemsPerPage);

  const [featuredMovies, setFeaturedMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState (null)

  // Scroll functions
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

  // Create group
  async function handleCreateGroupForm(e) {
    e.preventDefault()
    if (!newGroupName) return;

    try {
      const userId = 1
      await createGroup(newGroupName, newGroupDescription, userId);
      setNewGroupName("");
      setNewGroupDescription("");
      setShowCreateForm(false);

      await loadGroups();
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  }

  // Delete group
  async function handleDeleteGroup(groupId) {
    const confirmed = window.confirm("Continuing will delete the group, are you sure?");
    if (!confirmed) return;
    try {
      await deleteGroup(groupId);
      await loadGroups();
    } catch (err) {
      console.error("Failed to delete group: ", err.response?.data || err);
    }
  }

  // Load groups and members
  async function loadGroups() {
    const data = await getGroups();
    setGroups(data);
    const memberData = {};
    for (const g of data) {
      try {
        memberData[g.group_id] = await getGroupMembers(g.group_id);
      } catch (e) {
        memberData[g.group_id] = [];
      }
    }
    setMembers(memberData);
    await loadRequests(data);
  }

  // Join requests
  async function loadRequests() {
    const allRequests = [];
    for (const g of groups) {
      try {
        const reqs = await getRequests(g.group_id);
        reqs.forEach(r => allRequests.push({ ...r, groupName: g.group_name, groupId: g.group_id }));
      } catch (e) {}
    }
    setRequests(allRequests);
  }

  // Remove member from group
  async function handleRemoveMember(groupId, userId) {
    await removeMember(groupId, userId);
    loadGroups();
  }

  // Accept/reject requests
  async function handleAccept(groupId, userId) {
    await acceptRequest(groupId, userId);
    loadRequests();
  }

  async function handleReject(groupId, userId) {
    await rejectRequest(groupId, userId);
    loadRequests();
  }

  // Load other users' groups
  async function loadOtherGroups() {
    const allGroups = await getGroups();
    const myGroupsIds = groups.map(g => g.group_id);
    const others = allGroups.filter(g => !myGroupsIds.includes(g.group_id));
    setOtherGroups(others);
  }

  // Hooks
  useEffect(() => {
    async function fetchGroups() {
      await loadGroups();
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      loadRequests();
    }
  }, [groups]);



useEffect(() => {
  let cancelled = false;

  async function loadMovies() {
    try {
      const res = await fetch(`${API_BASE}/movie/now-playing`);
      if (!res.ok) throw new Error("Failed to fetch now playing movies");

      const data = await res.json();
      // data voi olla suoraan array tai object.results
      const movies = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
      if (!cancelled) setFeaturedMovies(movies);

      console.log("Featured movies loaded:", movies);
    } catch (err) {
      console.error("Failed to load movies for group form", err);
    }
  }

  loadMovies();

  return () => { cancelled = true; };
}, []);

return (
  <>
    <h4 className="mt-4">Join group</h4>
    <div className="mt-4 join-groups-wrapper">
      {otherGroups.slice(currentIndex, currentIndex + itemsPerPage).map(group => (
        <div className="card small-card d-flex flex-column" key={group.group_id}>
          <img
            src={selectedMovie 
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` 
                  : (featuredMovies[0] 
                      ? `https://image.tmdb.org/t/p/w500${featuredMovies[0].poster_path}` 
                      : "https://via.placeholder.com/250x250.png?text=No+Image")} 
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
            src={selectedMovie 
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` 
                  : (featuredMovies[0] 
                      ? `https://image.tmdb.org/t/p/w500${featuredMovies[0].poster_path}` 
                      : "https://via.placeholder.com/250x250.png?text=No+Image")}
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
      <button className="btn btn-secondary" onClick={handleCreatedPrev} disabled={createdIndex === 0}>Prev</button>
      <button className="btn btn-secondary" onClick={handleCreatedNext} disabled={createdIndex + createdItemsPerPage >= groups.length}>Next</button>
    </div>

    <button type="button" className="btn btn-primary btn-sm mt-4" onClick={() => setShowCreateForm(true)}>Create new group</button>

    {showCreateForm && (
      <form className="mt-2 card p-5" onSubmit={handleCreateGroupForm}>
        <button type="button" className="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onClick={() => setShowCreateForm(false)}></button>
        <input type="text" className="form-control mb-2" placeholder="Group Name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
        <textarea className="form-control mb-2" placeholder="Group Description" value={newGroupDescription} onChange={e => setNewGroupDescription(e.target.value)} />

        <h5>Select a featured movie for this group:</h5>
        <div className="movies-grid mb-2" style={{ maxHeight: '200px', overflowX: 'auto', display: 'flex', gap: '0.5rem' }}>
          {featuredMovies.map(m => (
            <div 
              key={m.id} 
              className={`movie-card ${selectedMovie?.id === m.id ? 'selected' : ''}`}
              onClick={() => setSelectedMovie(m)}
              style={{ cursor: 'pointer', border: selectedMovie?.id === m.id ? '2px solid #007bff' : '1px solid #ccc', padding: '0.25rem' }}
            >
              {m.poster_path && <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} style={{ display: 'block' }} />}
              <p style={{ fontSize: '0.8rem', margin: 0 }}>{m.title}</p>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-success btn-sm">Create</button>
      </form>
    )}

    <h4 className="mt-4">Pending requests</h4>
    {requests.map(r => (
      <div key={`${r.groupId}-${r.user_id}`} className="d-flex justify-content-between align-items-center mb-1">
        <span>@{r.user_id} wants to join {r.groupName}</span>
        <div className="d-flex">
          <button type="button" className="btn btn-success btn-sm mb-1 me-2" onClick={() => handleAccept(r.groupId, r.user_id)}>Accept</button>
          <button type="button" className="btn btn-danger btn-sm ms-2 mb-1" onClick={() => handleReject(r.groupId, r.user_id)}>Reject</button>
        </div>
      </div>
    ))}

    <h4 className="mt-4">Joined groups</h4>
  </>
);
}
