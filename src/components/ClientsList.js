import React, { useEffect, useState } from "react";
import { getClients } from "../apiService";

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = "your-auth-token-here"; // Replace with actual token
        const data = await getClients(token);
        setClients(data.results);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchClients();
  }, []);

  return (
    <div>
      <h1>Clients</h1>
      {error && <p>{error}</p>}
      <ul>
        {clients.map((client) => (
          <li key={client.id}>{client.company_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientsList;

const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchClients = async () => {
    try {
      const token = "your-auth-token-here";
      const data = await getClients(token);
      setClients(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchClients();
}, []);

return (
  <div>
    <h1>Clients</h1>
    {loading ? <p>Loading...</p> : null}
    {error && <p>{error}</p>}
    <ul>
      {clients.map((client) => (
        <li key={client.id}>{client.company_name}</li>
      ))}
    </ul>
  </div>
);