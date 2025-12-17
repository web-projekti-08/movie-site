/*
  YKSITTÄISEN ELOKUVAN SIVU, NÄYTTÄÄ RYHMÄN TIEDOT, JÄSENET JA SISÄLLÖN
*/
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getGroupMembers,
  getGroupContent,
  createJoinRequest,
  getGroupData,
  removeMember
} from "../services/groupsService";

import { fetchMovieDetails } from "../services/movieService";

import MovieCard from "../components/MovieCard";
import GroupMembers from "../components/GroupMembers";
import JoinGroupButton from "../components/JoinGroupButton";
import './GroupDetails.css';

export default function GroupDetails() {
  const { groupId } = useParams();
  const { user, isOwnerInGroup, isMemberInGroup } = useAuth();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [content, setContent] = useState([]); // ELOKUVAT
  const [loading, setLoading] = useState(true);
  const [joinRequested, setJoinRequested] = useState(false);

  async function loadGroupData() {
    setLoading(true);
    try {
      const groupData = await getGroupData(groupId);
      setGroup(groupData);

      // LATAA JÄSENET JA SISÄLTÖ VAIN JOS KÄYTTÄJÄ ON JÄSEN TAI OMISTAJA
      if (isMemberInGroup(groupData.group_id) || isOwnerInGroup(groupData.group_id)) {
        const membersData = await getGroupMembers(groupData.group_id).catch(() => []);
        setMembers(membersData);

        const contentData = await getGroupContent(groupData.group_id).catch(() => []);

        // HAETAAN TIEDOT ELOKUVILLE MOVIESERVICELLÄ
        const detailedContent = await Promise.all(
          contentData.map(async (c) => {
            try {
              const movieRes = await fetchMovieDetails(c.media_id);

              // UNWRAPATAAN KOSKA EN TIEDÄ ONKO TYHMÄSTI TEHTY PALAUTUSMUOTO
              const movie = movieRes.details || movieRes;
              return { ...c, movie };
            } catch (err) {
              console.error("Failed to fetch movie details", c.media_id, err);
              return { ...c, movie: { title: "Unavailable", poster_path: null } };
            }
          })
        );

        setContent(detailedContent);
      }
    } catch (err) {
      console.error("Error loading group data:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadGroupData();
  }, [groupId, user]);

  // LIITTYMISPYYNNÖN KÄSITTELY
  async function handleJoinRequest() {
    await createJoinRequest(groupId);
    setJoinRequested(true);
  }

  // JÄSENEN POISTAMINEN
  const handleRemoveMember = async (memberId) => {
    await removeMember(groupId, memberId);
    loadGroupData();
  };

  // JÄSENEN LÄHTEMINEN
  const handleLeaveGroup = async (leaveUserId) => {
    await removeMember(groupId, leaveUserId);
    // TÄSSÄ VOI TEHDÄ JOTAIN LISÄÄ KUN KÄYTTÄJÄ LÄHTEE RYHMÄSTÄ
    // VAIKAK OHJATA MUULLE SIVULLE navigate()
    // NYT PITÄÄ PÄIVITTÄÄ SIVU ETTÄ HUOMAA MUUTOKSEN
  };

  if (loading) return <p>Loading...</p>;
  if (!group) return <p>Group not found</p>;

  // TARKISTETAAN ONKO KÄYTTÄJÄ OMISTAJA TAI JÄSEN
  const userIsOwner = user?.userId === group.owner_id;
  const userIsMember =
    userIsOwner || isMemberInGroup(group.group_id);

   return (
    <div className="group-details-page">
      {/* Header */}
      <div className="group-header">
        <h2>{group.group_name}</h2>
        <p>{group.description}</p>
      </div>

      {/* Members (if member or owner) */}
      {(userIsOwner || userIsMember) && (
        <div className="group-members-section">
          <h4>Members</h4>
          <GroupMembers
            members={members}
            ownerId={group.owner_id}
            userId={user.userId}
            onRemove={handleRemoveMember}
            onLeave={handleLeaveGroup}
          />
        </div>
      )}

      {/* Movies (if member or owner) */}
      {(userIsOwner || userIsMember) && (
        <div className="group-content-section">
          <h4>Group Movies</h4>
          <div className="movies-grid">
            {content.map((c) => (
              <MovieCard key={c.content_id} movie={c.movie} />
            ))}
          </div>
        </div>
      )}

      {/* Join Button */}
      {!userIsMember && !userIsOwner && (
        <div className="join-button-section">
          <JoinGroupButton 
            onRequest={handleJoinRequest} 
            joinRequested={joinRequested} 
          />
        </div>
      )}
    </div>
  );
}
