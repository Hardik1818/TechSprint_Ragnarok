import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import './Layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-wrapper">
                <Header />
                <main className="content">
                    {children}
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Layout;
