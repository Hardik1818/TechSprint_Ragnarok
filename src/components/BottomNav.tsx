import { NavLink } from 'react-router-dom';
import {
    Wallet,
    Settings,
    QrCode,
    History,
    Menu,
    Building2,
    TrendingUp,
    ShieldCheck,
    Globe,
    Home
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './BottomNav.css';
import { useState } from 'react';
import QRScanner from './QRScanner';

const BottomNav = () => {
    const { user } = useAppContext();

    if (!user) return null;

    // Helper to render a standard nav item
    const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <NavLink
            to={to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </NavLink>
    );

    const [showScanner, setShowScanner] = useState(false);

    // Render specific nav based on role
    if (user.role === 'employee') {
        return (
            <>
                <nav className="bottom-nav">
                    <NavItem to="/dashboard" icon={Home} label="Home" />
                    <NavItem to="/wallet" icon={Wallet} label="Wallet" />

                    <div className="scan-button-wrapper">
                        <button className="scan-button" onClick={() => setShowScanner(true)}>
                            <QrCode size={24} color="white" />
                        </button>
                        <span className="scan-label">Scan & Pay</span>
                    </div>

                    <NavItem to="/transactions" icon={History} label="History" />
                    <NavItem to="/settings" icon={Menu} label="Menu" />
                </nav>
                {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
            </>
        );
    }

    // Default/Admin Fallback (Standard Items)
    const getAdminItems = () => {
        if (user.role === 'org_admin') {
            return [
                { name: 'Overview', icon: Home, path: '/organization' },
                { name: 'Team', icon: Building2, path: '/org/employees' },
                { name: 'Payroll', icon: TrendingUp, path: '/org/payroll' },
                { name: 'Settings', icon: Settings, path: '/settings' },
            ];
        } else {
            return [
                { name: 'Regulatory', icon: ShieldCheck, path: '/regulatory' },
                { name: 'Compliance', icon: Globe, path: '/admin/compliance' },
                { name: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
            ];
        }
    };

    return (
        <nav className="bottom-nav">
            {getAdminItems().map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
