import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { WidthProvider, Responsive } from 'react-grid-layout';
import axios from 'axios';
import TodoList from  '../TodoList/TodoListComponent';

import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Dynamisk import av NotepadComponent
const NotepadComponent = lazy(() => import('../Notepad/NotepadComponent'));

const getCols = (width) => {
    return {
        lg: width >= 1024 ? 4 : 3,
        md: width >= 768 ? 3 : 2,
        sm: 1,
        xs: 1,
        xxs: 1,
    };
};

const DashboardDetail = ({ isSidebarOpen }) => {
    const { dashboardId } = useParams();
    const [layouts, setLayouts] = useState({ lg: [], md: [], sm: [], xs: [], xxs: [] });
    const [cols, setCols] = useState(getCols(window.innerWidth));
    const [dashboard, setDashboard] = useState(null);
    const [newNotepadName, setNewNotepadName] = useState('');
    const [notepads, setNotepads] = useState([]);
    const [widgetCounter, setWidgetCounter] = useState(1);
    const [todoLists, setTodoLists] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            const newCols = getCols(window.innerWidth);
            setCols(newCols);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get(`https://localhost:7287/dashboards/${dashboardId}`);
                setDashboard(response.data);
            } catch (error) {
                console.error('Error fetching dashboard:', error);
                alert("Failed to fetch dashboard");
            }
        };

        fetchDashboard();
    }, [dashboardId]);

    useEffect(() => {
        if (dashboardId) {
            axios.get(`https://localhost:7287/dashboards/${dashboardId}/notepads`)
                .then(response => {
                    setNotepads(response.data);
                })
                .catch(error => {
                    console.error('Error fetching notepads:', error);
                });
        }
    }, [dashboardId]);

    useEffect(() => {
        if (dashboardId) {
            axios.get(`https://localhost:7287/dashboards/${dashboardId}/todolists`)
                .then(response => {
                    setTodoLists(response.data);
                })
                .catch(error => {
                    console.error('Error fetching TodoLists:', error);
                });
        }
    }, [dashboardId]);

    const dashTodos = todoLists.map(t => (
        <TodoList key={t.id} id={t.id} name={t.name} />
    ));

    const createNotepad = (name) => {
        if (!name.trim()) {
            alert('Notepad name cannot be empty.');
            return;
        }

        axios.post(`https://localhost:7287/dashboards/${dashboardId}/notepads`, { name, dashboardId })
            .then(response => {
                setNotepads([...notepads, { ...response.data, notes: [] }]);
                setNewNotepadName('');
                addWidget('notepad', response.data.id);
            })
            .catch(error => {
                console.error('Error creating notepad:', error);
                alert('Error creating notepad. Please try again.');
            });
    };

    const addWidget = (widgetType, notepadId = null) => {
        if (!widgetType) return;

        const newWidget = {
            i: `widget${widgetCounter}-${widgetType}`,
            x: (layouts.lg.length % cols.lg),
            y: Infinity, // puts it at the bottom
            w: 1,
            h: 2,
            type: widgetType,
            notepadId: notepadId,
        };

        setLayouts((prevLayouts) => {
            const newLayouts = { ...prevLayouts };
            Object.keys(newLayouts).forEach((key) => {
                newLayouts[key] = [...newLayouts[key], newWidget];
            });
            return newLayouts;
        });

        setWidgetCounter(widgetCounter + 1);
    };

    const handleLayoutChange = (newLayout, allLayouts) => {
        setLayouts(allLayouts);
        localStorage.setItem('dashboard-layouts', JSON.stringify(allLayouts));
    };

    const handleBreakpointChange = (newBreakpoint) => {
        const newCols = getCols(window.innerWidth);
        setCols(newCols);
    };

    const handleAddWidget = (e) => {
        const widgetType = e.target.value;
        if (widgetType === 'notepad') {
            createNotepad('New Notepad');
        }
    };

    return (
        <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className='dashboard-container'>
                <h2 className="dashboard-title">{dashboard ? dashboard.name : 'Loading...'}
                    <br />
                    {dashTodos}
                </h2>
                <div>
                    <input
                        type="text"
                        value={newNotepadName}
                        onChange={(e) => setNewNotepadName(e.target.value)}
                        placeholder="New notepad name"
                    />
                    <button onClick={() => createNotepad(newNotepadName)}>Create Notepad</button>
                </div>
                <div>
                    <select onChange={handleAddWidget}>
                        <option value="">Add Widget</option>
                        <option value="notepad">Notepad</option>
                        {/* Add more widget options here */}
                    </select>
                </div>
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    cols={cols}
                    rowHeight={30}
                    margin={[20, 20]}
                    draggableHandle=".grid-item__title"
                    isResizable={true}
                    onLayoutChange={handleLayoutChange}
                    onBreakpointChange={handleBreakpointChange}
                    breakpoints={{ lg: 1024, md: 768, sm: 480, xs: 360, xxs: 0 }}
                    resizeHandles={['se']}
                >
                    {layouts.lg.map((item) => (
                        <div key={item.i} className="grid-item">
                            <div className="grid-item__title">Widget {item.i.replace('widget', '')}</div>
                            <div className="grid-item__content">
                                {item.type === 'notepad' ? (
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <NotepadComponent dashboardId={dashboardId} notepads={notepads} setNotepads={setNotepads} />
                                    </Suspense>
                                ) : (
                                    `Content for ${item.i}`
                                )}
                            </div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default DashboardDetail;