/*
  LIITTYMISPYYNNÖT KOMPONENTTI
*/

export default function RequestsList({ requests, onAccept, onReject }) {
  return (
    <>
      <h4 className="mt-4">Pending requests</h4>
      {requests.length === 0 && <p>No pending requests.</p>}

      {requests.map((r) => (
        <div key={`${r.groupId}-${r.user_id}`} className="d-flex justify-content-between mt-2">
          <span>
            {r.email || `User ${r.user_id}`} wants to join {r.groupName}
          </span>
          <div>
            <button
              className="btn btn-success btn-sm"
              onClick={() => onAccept(r.groupId, r.user_id)}
            >
              Accept
            </button>
            <button
              className="btn btn-danger btn-sm ms-2"
              onClick={() => onReject(r.groupId, r.user_id)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
