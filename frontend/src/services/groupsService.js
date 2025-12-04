import { authFetch } from './authFetch'

const API_URL = process.env.REACT_APP_API_URL

// GET kaikki ryhmät
export async function getGroups() {
  const res = await authFetch("/groups");
  return await res.json();
}

// GET käyttäjän ryhmät
export async function getUserGroups() {
  const res = await authFetch("/groups/user");
  return await res.json();
}

// GET ryhmän jäsenet
export async function getGroupMembers(groupId) {
  const res = await authFetch(`/groups/${groupId}/members`);
  return await res.json();
}

// DELETE jäsen
export async function removeMember(groupId, userId) {
  const res = await authFetch(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE"
  });
  return await res.json();
}

// POST uusi ryhmä
export async function createGroup(groupName, description, userId) {
  const res = await authFetch("/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupName, description, userId })
  });
  return await res.json();
}

// DELETE ryhmä
export async function deleteGroup(groupId) {
  const res = await authFetch(`/groups/${groupId}`, {
    method: "DELETE"
  });
  
}

// GET liittymispyynnöt
export async function getRequests(groupId) {
  const res = await authFetch(`/groups/${groupId}/requests`);
  return await res.json();
}

// PATCH hyväksy pyyntö
export async function acceptRequest(groupId, userId) {
  return authFetch(`/groups/${groupId}/requests/${userId}/accept`, {
    method: "PATCH"
  });
}

// DELETE hylkää pyyntö
export async function rejectRequest(groupId, userId) {
  return authFetch(`/groups/${groupId}/requests/${userId}/reject`, {
    method: "DELETE"
  });
}


