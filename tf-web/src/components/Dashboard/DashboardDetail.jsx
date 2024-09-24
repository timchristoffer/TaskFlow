import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WidthProvider, Responsive } from 'react-grid-layout';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardDetail = () => {
    const { dashboardName } = useParams();
    const [layout, setLayout] = useState(getInitialLayout());
    const [cols, setCols] = useState(getCols(window.innerWidth));

    function getCols(width) {
        if (width < 480) return { lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 };
        if (width < 768) return { lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 };
        if (width < 1024) return { lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 };
        return { lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 };
    }

    function getInitialLayout() {
        return [
            { i: 'widget1', x: 0, y: 0, w: 2, h: 4, minW: 1, maxW: 6, minH: 2, maxH: 6 },
            { i: 'widget2', x: 2, y: 0, w: 2, h: 4, minW: 1, maxW: 6, minH: 2, maxH: 6 },
            { i: 'widget3', x: 0, y: 2, w: 2, h: 4, minW: 1, maxW: 6, minH: 2, maxH: 6 },
            { i: 'widget4', x: 2, y: 2, w: 2, h: 4, minW: 1, maxW: 6, minH: 2, maxH: 6 },
            { i: 'widget5', x: 0, y: 4, w: 2, h: 4, minW: 1, maxW: 6, minH: 2, maxH: 6 },
            { i: 'widget6', x: 2, y: 4, w: 2, h: 4, minW: 1, maxW: 6, minH: 2, maxH: 6 },
        ];
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

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
    };

    return (
        <div className='dashboard'>
            <div className='dashboard-container'>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>Dashboard Details</h2>
                <p style={{ color: '#fff', textAlign: 'center' }}>Dashboard Name: {dashboardName}</p>
                <ResponsiveGridLayout
                    className="layout"
                    layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                    cols={cols}
                    rowHeight={30}
                    margin={[20, 20]}
                    draggableHandle=".grid-item__title"
                    isResizable={true}
                    onLayoutChange={handleLayoutChange}
                    breakpoints={{ lg: 1024, md: 768, sm: 480, xs: 360, xxs: 0 }}
                    resizeHandles={['se']}
                    measureBeforeMount={false}
                >
                    {layout.map((item) => (
                        <div key={item.i} className="grid-item">
                            <div className="grid-item__title">Widget {item.i.replace('widget', '')}</div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default DashboardDetail;
