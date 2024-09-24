import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WidthProvider, Responsive } from 'react-grid-layout';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardDetail = () => {
    const { dashboardName } = useParams();
    const [layouts, setLayouts] = useState(getInitialLayouts());
    const [cols, setCols] = useState(getCols(window.innerWidth));

    function getCols(width) {
        return {
            lg: width >= 1024 ? 4 : 3,
            md: width >= 768 ? 3 : 2,
            sm: 1,
            xs: 1,
            xxs: 1,
        };
    }

    function getInitialLayouts() {
        const savedLayouts = JSON.parse(localStorage.getItem('dashboard-layouts'));
        return savedLayouts || {
            lg: [
                { i: 'widget1', x: 0, y: 0, w: 1, h: 2 },
                { i: 'widget2', x: 1, y: 0, w: 1, h: 2 },
                { i: 'widget3', x: 2, y: 0, w: 1, h: 2 },
                { i: 'widget4', x: 3, y: 0, w: 1, h: 2 },
                { i: 'widget5', x: 0, y: 1, w: 1, h: 2 },
                { i: 'widget6', x: 1, y: 1, w: 1, h: 2 },
            ],
            md: [],
            sm: [
                { i: 'widget1', x: 0, y: 0, w: 1, h: 3 },
                { i: 'widget2', x: 0, y: 1, w: 1, h: 3 },
                { i: 'widget3', x: 0, y: 2, w: 1, h: 3 },
                { i: 'widget4', x: 0, y: 3, w: 1, h: 3 },
                { i: 'widget5', x: 0, y: 4, w: 1, h: 3 },
                { i: 'widget6', x: 0, y: 5, w: 1, h: 3 },
            ],
            xs: [
                { i: 'widget1', x: 0, y: 0, w: 1, h: 4 },
                { i: 'widget2', x: 0, y: 1, w: 1, h: 4 },
                { i: 'widget3', x: 0, y: 2, w: 1, h: 4 },
                { i: 'widget4', x: 0, y: 3, w: 1, h: 4 },
                { i: 'widget5', x: 0, y: 4, w: 1, h: 4 },
                { i: 'widget6', x: 0, y: 5, w: 1, h: 4 },
            ],
            xxs: [
                { i: 'widget1', x: 0, y: 0, w: 1, h: 5 },
                { i: 'widget2', x: 0, y: 1, w: 1, h: 5 },
                { i: 'widget3', x: 0, y: 2, w: 1, h: 5 },
                { i: 'widget4', x: 0, y: 3, w: 1, h: 5 },
                { i: 'widget5', x: 0, y: 4, w: 1, h: 5 },
                { i: 'widget6', x: 0, y: 5, w: 1, h: 5 },
            ],
        };
    }

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

    const handleLayoutChange = (newLayout, allLayouts) => {
        setLayouts(allLayouts);
        localStorage.setItem('dashboard-layouts', JSON.stringify(allLayouts));
    };

    const handleBreakpointChange = (newBreakpoint) => {
        const newCols = getCols(window.innerWidth);
        setCols(newCols);
    };

    return (
        <div className='dashboard'>
            <div className='dashboard-container'>
                <h2 className="dashboard-title">{dashboardName}</h2>
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
                            <div className="grid-item__content">Content for {item.i}</div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default DashboardDetail;