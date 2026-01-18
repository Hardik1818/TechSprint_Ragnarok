import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    Building2,
    Settings,
    ShieldCheck,
    TrendingUp,
    Globe,
    Home
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './BottomNav.css';

const BottomNav = () => {
    const { user } = useAppContext();

    const getMenuItems = () => {
        if (user?.role === 'employee') {
            return [
                { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
                { name: 'Wallet', icon: Wallet, path: '/wallet' },
                { name: 'Settings', icon: Settings, path: '/settings' },
            ];
        } else if (user?.role === 'org_admin') {
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

    const menuItems = getMenuItems();

    // If no user is logged in (e.g. login page), don't show nav
    if (!user) return null;

    return (
        <nav className="bottom-nav">
            {menuItems.map((item) => (
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
