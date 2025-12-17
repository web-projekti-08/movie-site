import { authFetch } from './authFetch'
import { API_URL } from './authApi'

// GET kaikki ryhmät
export async function getGroups() {
  const res = await fetch(`${API_URL}/groups`);
  if (!res.ok) return [];
  return await res.json();
}

// GET käyttäjän ryhmät
export async function getUserGroups() {
  const res = await authFetch("/groups/user");
  if (!res.ok) return [];
  return await res.json();
}

// GET ryhmän jäsenet
export async function getGroupMembers(groupId) {
  const res = await authFetch(`/groups/${groupId}/members`);

  if (!res.ok) {
    // User might not have access → safe fail
    return [];
  }
  return await res.json();
}

// DELETE jäsen
export async function removeMember(groupId, userId) {
  const res = await authFetch(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Unable to remove member");
  return await res.json();
}

// POST uusi ryhmä
export async function createGroup(groupName, description) {
  const res = await authFetch("/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupName, description})
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create group");
  }

  return await res.json();
}

// DELETE ryhmä
export async function deleteGroup(groupId) {
  const res = await authFetch(`/groups/${groupId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete group");
  }

  // 204 No Content → return null
  if (res.status === 204) return null;

  return await res.json();
}

// GET liittymispyynnöt
export async function getRequests(groupId) {
  const res = await authFetch(`/groups/${groupId}/requests`);

  if (!res.ok) return [];
  return await res.json();
}

// PATCH hyväksy pyyntö
export async function acceptRequest(groupId, userId) {
  const res = await authFetch(
    `/groups/${groupId}/requests/${userId}/accept`,
    { method: "PATCH" }
  );

  if (!res.ok) throw new Error("Failed to accept request");

  if (res.status === 204) return null;

  return await res.json();
}

// DELETE hylkää pyyntö
export async function rejectRequest(groupId, userId) {
  const res = await authFetch(
    `/groups/${groupId}/requests/${userId}/reject`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to reject request");

  // 204 No Content → return null
  if (res.status === 204) return null;

  return await res.json();
}

// HAE RYHMÄN TIEDOT
export async function getGroupData(groupId) {
  const res = await authFetch(`/groups/${groupId}`);
  return await res.json();
}


// TEE LIITTYMISPYYNTÖ
export async function createJoinRequest(groupId) {
  const res = await authFetch(`/groups/${groupId}/requests`, { method: "POST" });
  return await res.json();
}

// HAE KONTENTTI
export async function getGroupContent(groupId) {
  const res = await authFetch(`/groups/${groupId}/content`);
  return await res.json();
}

// LISÄÄ KONTENTTI
export async function addGroupContent(groupId, mediaId) {
  const res = await authFetch(`/groups/${groupId}/content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaId }),
  });
  return await res.json();
}

