
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    Building2,
    Settings,
    ShieldCheck,
    LogOut,
    ChevronRight,
    TrendingUp,
    Globe
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    const getMenuItems = () => {
        if (user?.role === 'employee') {
            return [
                { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                { name: 'My Wallet', icon: Wallet, path: '/wallet' },
                { name: 'Settings', icon: Settings, path: '/settings' },
            ];
        } else if (user?.role === 'org_admin') {
            return [
                { name: 'Org Overview', icon: LayoutDashboard, path: '/organization' },
                { name: 'Employees', icon: Building2, path: '/org/employees' },
                { name: 'Payroll Stream', icon: TrendingUp, path: '/org/payroll' },
                { name: 'Settings', icon: Settings, path: '/settings' },
            ];
        } else {
            return [
                { name: 'Regulatory Hub', icon: ShieldCheck, path: '/regulatory' },
                { name: 'Compliance', icon: Globe, path: '/admin/compliance' },
                { name: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
            ];
        }
    };

    const menuItems = getMenuItems();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
                <div className="logo-icon">DP</div>
                <span className="logo-text">DailyPay <span className="accent">Nepal</span></span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                        <ChevronRight className="chevron" size={16} />
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
