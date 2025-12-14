import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddToGroupButton({ movieId, onAdd }) {
  const { user} = useAuth();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(false);

  const userGroups = user?.groups || [];

  useEffect(() => {
    if (userGroups.length > 0) {
      setSelectedGroup(userGroups[0].group_id);
    }
  }, [userGroups]);

  const handleClick = async () => {
    if (!selectedGroup) {
      alert("Please select a group");
      return;
    }
    setLoading(true);
    try {
      await onAdd(selectedGroup, movieId);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Please login to add movies to your groups.</p>;
  if (!userGroups || userGroups.length === 0) return <p>No groups. Join or create one first.</p>;

  return (
    <div>
      <select className="group-select" value={selectedGroup} 
        onChange={e => setSelectedGroup(e.target.value)} 
        disabled={loading}
      >
        <option value="">Select a group</option>
        {userGroups
          .filter(g => g.role !== "requested")
          .map(g => (
            <option key={g.group_id} value={g.group_id}>
              {g.group_name}
            </option>
          ))}
      </select>

      <button onClick={handleClick} disabled={loading}>
        {loading ? "Adding..." : "Add to Group"}
      </button>
    </div>
  );
}
