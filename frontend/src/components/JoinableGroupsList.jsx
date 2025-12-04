/*
  NÄYTTÄÄ KAIKKI RYHMÄT GROUPS ETUSIVULLA KOMPONENTTI, NIMETTY EHKÄ TYHMÄSTI
  TÄHÄN PITÄÄ LISÄTÄ/MUOKATA JOS HALUAA NÄYTTÄÄ VAIKKA NE RYMÄN KUVAT
*/

import { useNavigate } from "react-router-dom";

export default function JoinableGroupsList({ groups }) {
  const navigate = useNavigate();

  return (
    <>
      <h4 className="mt-4">Join group</h4>
      <div className="mt-4 join-groups-wrapper">
        {groups.map(group => (
          <div className="card small-card" key={group.group_id}>
            <img src="/placeholder.png" className="card-img-top" alt="" />
            <div className="card-body">
              <h5
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/groups/${group.group_id}`)}
              >
                {group.group_name}
              </h5>
              <p>{group.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
