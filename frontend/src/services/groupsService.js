import axios from 'axios'

const API_URL = 'http://localhost:3001/groups'

// GET (hae kaikki ryhmät)

export async function getGroups() {
    const res = await axios.get(API_URL)
    return res.data
}

// GET (hae tietyn ryhmän jäsenet)

export async function getGroupMembers(groupId) {
    const res = await axios.get(`${API_URL}/${groupId}/members`)
    return res.data
}

// DELETE (poista jäsen)

export async function removeMember(groupId, userId) {
    const res = await axios.delete(`${API_URL}/${groupId}/members/${userId}`)
    return res.data
}

// POST (luo uusi ryhmä)

export async function createGroup(data) {
    const res = await axios.post(API_URL, data)
    return res.data
}

// DELETE (poista ryhmä)

export async function deleteGroup(groupId) {
    const res = await axios.delete(`${API_URL}/${groupId}`)
    return res.data
}

// GET (odottavat liittymispyynnöt)

export async function getRequests(groupId) {
    const res = await axios.get(`${API_URL}/${groupId}/requests`)
    return res.data
}

// PATCH (hyväksy pyyntö)

export async function acceptRequest(groupId, userId) {
    return axios.patch(`${API_URL}/${groupId}/requests/${userId}/accept`)
}

// DELETE (hylkää pyyntö)

export async function rejectRequest(groupId, userId) {
    return axios.delete(`${API_URL}/${groupId}/requests/${userId}/reject`)

}
