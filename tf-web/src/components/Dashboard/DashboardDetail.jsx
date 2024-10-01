import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { WidthProvider, Responsive } from 'react-grid-layout';
import axios from 'axios';
import TodoList from '../TodoList/TodoListComponent';

import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Dynamisk import av NotepadComponent
const NotepadComponent = lazy(() => import('../Notepad/NotepadComponent'));

const getCols = (width) => {
    return {
        xlg: width >= 5000 ? 5 : 4,
        lg: width >= 1224 ? 5 : 3,
        md: width >= 768 ? 3 : 2,
        sm: 1,
        xs: 1,
        xxs: 1,
    };
};

const DashboardDetail = ({ isSidebarOpen }) => {
    const { dashboardId } = useParams();
    const [layouts, setLayouts] = useState({ xlg: [], lg: [], md: [], sm: [], xs: [], xxs: [] });
    const [cols, setCols] = useState(getCols(window.innerWidth));
    const [dashboard, setDashboard] = useState(null);
    const [newNotepadName, setNewNotepadName] = useState('');
    const [notepads, setNotepads] = useState([]);
    const [widgetCounter, setWidgetCounter] = useState(1);
    const [todolists, setTodolists] = useState([]);
    const [newTodolistName, setNewTodolistName] = useState('');

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
            axios.get(`https://localhost:7287/notepads`)
                .then(response => {
                    setNotepads(response.data);
                    response.data.forEach(notepad => {
                        addWidget('notepad', notepad.id, notepad.name);
                    });
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
                    setTodolists(response.data);
                    response.data.forEach(todoList => {
                        addWidget('todolist', todoList.id, todoList.name);
                    });
                })
                .catch(error => {
                    console.error('Error fetching TodoLists:', error);
                });
        }
    }, [dashboardId]);

    const dashTodos = todolists.map(td =>  
        <TodoList key={td.id} id={td.id} name={td.name}/>
    );

    const createNotepad = (name) => {
        if (!name.trim()) {
            alert('Notepad name cannot be empty.');
            return;
        }

        axios.post(`https://localhost:7287/notepads`, { name, dashboardId })
            .then(response => {
                setNotepads([...notepads, { ...response.data, notes: [] }]);
                setNewNotepadName('');
                addWidget('notepad', response.data.id, response.data.name);
            })
            .catch(error => {
                console.error('Error creating notepad:', error);
                alert('Error creating notepad. Please try again.');
            });
    };

    const createTodolist = (name) => {
        if (!name.trim()) {
            alert('Todo list name cannot be empty.');
            return;
        }

        axios.post(`https://localhost:7287/todolist`, { name, dashboardId })
            .then(response => {
                setTodolists([...todolists, { ...response.data, todos: [] }]);
                setNewTodolistName('');
                addWidget('todolist', response.data.id, response.data.name);
            })
            .catch(error => {
                console.error('Error creating todolist:', error);
                alert('Error creating todolist. Please try again.');
            });
    };

    const removeNotepad = (notepadId) => {
        axios.delete(`https://localhost:7287/notepads/${notepadId}`)
            .then(() => {
                setNotepads(notepads.filter(notepad => notepad.id !== notepadId));
                setLayouts((prevLayouts) => {
                    const newLayouts = { ...prevLayouts };
                    Object.keys(newLayouts).forEach((key) => {
                        newLayouts[key] = newLayouts[key].filter(item => item.widgetId !== notepadId);
                    });
                    return newLayouts;
                });
            })
            .catch(error => {
                console.error('Error removing notepad:', error);
                alert('Error removing notepad. Please try again.');
            });
    };
    const removeTodoList = (todoListId) => {
        axios.delete(`https://localhost:7287/todolist/${todoListId}`)
            .then(() => {
                setTodolists(todolists.filter(todoList => todoList.id !== todoListId));
                setLayouts((prevLayouts) => {
                    const newLayouts = { ...prevLayouts };
                    Object.keys(newLayouts).forEach((key) => {
                        newLayouts[key] = newLayouts[key].filter(item => item.widgetId !== todoListId);
                    });
                    return newLayouts;
                });
            })
            .catch(error => {
                console.error('Error removing notepad:', error);
                alert('Error removing notepad. Please try again.');
            });
    };

    const addWidget = (widgetType, widgetId = null, widgetName = '') => {
        if (!widgetType) return;

        const newWidget = {
            i: `widget${widgetCounter}-${widgetType}-${widgetId || ''}`,
            x: (layouts.xlg.length % cols.xlg),
            y: Infinity, // puts it at the bottom
            w: 1,
            h: 2,
            type: widgetType,
            widgetId: widgetId,
            widgetName: widgetName,
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
        } else if (widgetType === 'todolist') {
            createTodolist('New Todolist');
        }
    };

    return (
        <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className='dashboard-container'>
                <h2 className="dashboard-title">{dashboard ? dashboard.name : 'Loading...'}</h2>
                <div className='dropdown-container'>
                    <select className='dropdown' onChange={handleAddWidget}>
                        <option value="">Add Widget</option>
                        <option value="notepad">Notepad</option>
                        <option value="todolist">Todo List</option>
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
                    breakpoints={{ xlg: 5000, lg: 1224, md: 768, sm: 480, xs: 360, xxs: 0 }}
                    resizeHandles={['se']}
                >
                    {(() => {
                        const seenIds = new Set();
                        return layouts.xlg.filter(item => {
                            if (seenIds.has(item.i)) {
                                return false;
                            } else {
                                seenIds.add(item.i);
                                return true;
                            }
                        }).map((item) => (
                            <div key={item.i} className="grid-item">
                                <div className="grid-item__title">{item.type || `Widget ${item.i.replace('widget', '')}`}</div>
                                <div className="grid-item__content">
                                    {item.type === 'todolist' ? (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <TodoList 
                                                id={item.widgetId} 
                                                name={item.widgetName}
                                                removeTodoList={removeTodoList}
                                            />   
                                        </Suspense>
                                    ) : item.type === 'notepad' ? (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <NotepadComponent
                                                dashboardId={dashboardId}
                                                notepadId={item.widgetId}
                                                removeNotepad={removeNotepad}
                                            />
                                        </Suspense>
                                    ) : (
                                        `Content for ${item.i}`
                                    )}
                                </div>
                            </div>
                        ));
                    })()}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default DashboardDetail;