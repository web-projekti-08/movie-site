/*
  RYHMÄÄN LIITTYMISNAPPI KOMPONENTTI
*/

export default function JoinGroupButton({ onRequest, joinRequested }) {
  return !joinRequested ? (
    <button onClick={onRequest}>Request to join</button>
  ) : (
    <p>Join request sent</p>
  );
}