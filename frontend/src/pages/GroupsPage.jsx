/*
  GROUPS SIVU, NÄYTTÄÄ KAIKKI RYHMÄT JA RYHMÄN LUOMISEN
*/

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getGroups,
  getRequests,
  createGroup,
  deleteGroup,
  acceptRequest,
  rejectRequest,
} from "../services/groupsService";

import JoinableGroupsList from "../components/JoinableGroupsList";
import CreatedGroupsList from "../components/CreatedGroupsList";
import CreateGroupForm from "../components/CreateGroupForm";
import RequestsList from "../components/RequestsList";

export default function GroupsPage() {
  const { user } = useAuth();

  const [groups, setGroups] = useState([]); // KÄYTTÄJÄN LUOMAT RYHMÄT
  const [allGroups, setAllGroups] = useState([]); // KAIKKI RYHMÄT
  const [requests, setRequests] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  async function loadGroups() {
    if (!user) return;

    const all = await getGroups();
    setAllGroups(all);

    // LUODUT RYHMÄT
    const created = all.filter((g) => g.owner_id === user.userId);
    setGroups(created);

    // LIITTYMISPYYNNÖT HAETAAN KAIKILLE KÄYTTÄJÄN LUOMILLE RYHMILLE
    const reqs = [];
    for (const g of created) {
      const r = await getRequests(g.group_id).catch(() => []);
      reqs.push(
        ...r.map((x) => ({
          ...x,
          groupName: g.group_name,
          groupId: g.group_id,
        }))
      );
    }
    setRequests(reqs);
  }

  useEffect(() => {
    loadGroups();
  }, [user]);

  return (
    <> 
      {/* KAIKKI RYHMÄT LISTA, KÄYTTÄÄ JoinableGroupsList KOMPONENTTIA */ }
      <JoinableGroupsList groups={allGroups} />

      {/* KÄYTTÄJÄN LUOMAT RYHMÄT LISTA, KÄYTTÄÄ CreatedGroupsList KOMPONENTTIA */ }
      <CreatedGroupsList
        groups={groups}
        onDelete={async (id) => {
          await deleteGroup(id);
          loadGroups();
        }}
      />

      <button
        className="btn btn-primary btn-sm mt-4"
        onClick={() => setShowCreateForm(true)}
      >
        Create new group
      </button>
      
      {/* UUDEN RYHMÄN LUONTI FORM, KÄYTTÄÄ JoinableGroupsList KOMPONENTTIA */ }
      {showCreateForm && (
        <CreateGroupForm
          onClose={() => setShowCreateForm(false)}
          onCreate={async (name, desc) => {
            await createGroup(name, desc);
            loadGroups();
          }}
        />
      )}

      {/* LIITTYMISPYYNNÖT LISTA, KÄYTTÄÄ RequestsList KOMPONENTTIA */ }
      <RequestsList
        requests={requests}
        onAccept={async (gid, uid) => {
          await acceptRequest(gid, uid);
          setRequests((prev) => prev.filter((r) => r.user_id !== uid));
        }}
        onReject={async (gid, uid) => {
          await rejectRequest(gid, uid);
          setRequests((prev) => prev.filter((r) => r.user_id !== uid));
        }}
      />
    </>
  );
}

