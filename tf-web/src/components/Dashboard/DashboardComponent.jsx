import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DashboardComponent.css'; // Importera CSS-filen

const DashboardComponent = ({ isSidebarOpen }) => {
    const [name, setName] = useState('');
    const [dashboards, setDashboards] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDashboards = async () => {
            try {
                const response = await axios.get('https://localhost:7287/dashboards');
                setDashboards(response.data);
            } catch (error) {
                console.error('Error fetching dashboards:', error);
                alert("Failed to fetch dashboards");
            }
        };

        fetchDashboards();
    }, []);

    const handleCreateDashboard = async (e) => {
        e.preventDefault();
        console.log("Creating dashboard with name:", name);
        try {
            const response = await axios.post('https://localhost:7287/dashboards', { name });
            console.log("Response:", response);
            setDashboards([...dashboards, response.data]);
            setName('');
        } catch (error) {
            console.error('Error creating dashboard:', error);
            alert("Failed to create dashboard");
        }
    };

    const handleDeleteDashboard = async (id) => {
        console.log("Deleting dashboard with id:", id);
        try {
            await axios.delete(`https://localhost:7287/dashboards/${id}`);
            setDashboards(dashboards.filter(dashboard => dashboard.id !== id));
        } catch (error) {
            console.error('Error deleting dashboard:', error);
            alert("Failed to delete dashboard");
        }
    };

    return (
        <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className='dashboard-container'>
                <h2>Create Dashboard</h2>
                <form className="dashboard-form" onSubmit={handleCreateDashboard}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dashboard Name"
                        required
                    />
                    <button type="submit">Create</button>
                </form>

                {message && <p>{message}</p>}

                <h3>Dashboards</h3>
                <ul className="dashboard-list">
                    {dashboards.map((dashboard) => (
                        <li key={dashboard.id} className="dashboard-item">
                            <Link to={`/dashboard/${dashboard.id}`}>{dashboard.name}</Link>
                            <button onClick={() => handleDeleteDashboard(dashboard.id)} className="delete-button">
                                <img src="/Icons/delete.svg" alt="Delete" className="delete-icon" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardComponent;