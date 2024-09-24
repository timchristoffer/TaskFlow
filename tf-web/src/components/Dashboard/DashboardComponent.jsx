import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const DashboardComponent = () => {
    const [name, setName] = useState('');
    const [dashboards, setDashboards] = useState([]);
    const [message, setMessage] = useState(''); // För statusmeddelanden

    // Hämta dashboards när komponenten laddas
    useEffect(() => {
        const fetchDashboards = async () => {
            try {
                const response = await axios.get('http://localhost:5000/dashboards');
                setDashboards(response.data); // Sätt dashboards i state
            } catch (error) {
                console.error('Error fetching dashboards:', error);
                alert("Failed to fetch dashboards");
            }
        };

        fetchDashboards();
    }, []); // Tom array betyder att detta körs en gång när komponenten laddas

    const handleCreateDashboard = async (e) => {
        e.preventDefault();
        console.log("Creating dashboard with name:", name); // Debug-meddelande
        try {
            const response = await axios.post('http://localhost:5000/dashboards', { name });
            console.log("Response:", response); // Debug-meddelande
            setDashboards([...dashboards, response.data]); // Lägg till den nya dashboarden i listan
            setName(''); // Rensa input-fältet
        } catch (error) {
            console.error('Error creating dashboard:', error);
            alert("Failed to create dashboard"); // Meddelande till användaren
        }
    };

    return (
        <div>
            <h2>Create Dashboard</h2>
            <form onSubmit={handleCreateDashboard}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dashboard Name"
                    required
                />
                <button type="submit">Create</button>
            </form>

            {/* Visa statusmeddelande */}
            {message && <p>{message}</p>}

            <h3>Dashboards</h3>
            <ul>
                {dashboards.map((dashboard) => (
                    <li key={dashboard.id}>
                        <Link to={`/dashboard/${dashboard.name}`}>{dashboard.name}</Link> {/* Update link to use dashboard name */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardComponent;
