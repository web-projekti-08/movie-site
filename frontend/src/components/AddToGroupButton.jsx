import { useState, useEffect } from "react";

export default function AddToGroupButton({ movieId, userGroups, onAdd }) {
  const [selectedGroup, setSelectedGroup] = useState(userGroups[0]?.group_id || "");

  useEffect(() => {
    if (userGroups.length > 0) setSelectedGroup(userGroups[0].group_id);
  }, [userGroups]);

  const handleClick = async () => {
    if (!selectedGroup) return;
    await onAdd(selectedGroup, movieId);
  };

  return (
    <div>
      <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
        {userGroups.map(g => (
          <option key={g.group_id} value={g.group_id}>{g.group_name}</option>
        ))}
      </select>
      <button onClick={handleClick}>Add to Group</button>
    </div>
  );
}