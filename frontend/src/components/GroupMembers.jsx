/*
  RYHMÄN JÄSENLISTA KOMPONENTTI
*/

export default function GroupMembers({ members, ownerId, userId, onRemove, onLeave }) {
  console.log("userId", userId, "ownerId", ownerId, "members", members);
  return (
    <div>
      <h4>Members</h4>
      <ul>
        {members.map((m) => (
          <li key={m.user_id}>
            {/* ITSE LISTA */}
            {m.role === 'owner' ? <strong>Owner</strong> : m.role} — {m.email}

            {/* OMISTAJA VOI POISTAA JÄSENIÄ NAPPI */}
            {userId === ownerId && m.user_id !== ownerId && (
              <button onClick={() => onRemove(m.user_id)}>Remove</button>
            )}

            {/* JÄSEN VOI POISTUA NAPPI */}
            {userId === m.user_id && m.user_id !== ownerId && (
              <button onClick={() => onLeave(m.user_id)}>Leave</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}