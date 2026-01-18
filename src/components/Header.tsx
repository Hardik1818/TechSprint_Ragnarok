
import { useState } from 'react';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getMenuItems = () => {
        if (user?.role === 'employee') {
            return [
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'My Wallet', path: '/wallet' },
                { name: 'Settings', path: '/settings' },
            ];
        } else if (user?.role === 'org_admin') {
            return [
                { name: 'Org Overview', path: '/organization' },
                { name: 'Employees', path: '/org/employees' },
                { name: 'Payroll Stream', path: '/org/payroll' },
                { name: 'Settings', path: '/settings' },
            ];
        } else {
            return [
                { name: 'Regulatory Hub', path: '/regulatory' },
                { name: 'Compliance', path: '/admin/compliance' },
                { name: 'Analytics', path: '/admin/analytics' },
            ];
        }
    };

    const menuItems = getMenuItems();

    const handleMenuClick = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="header">
                <div className="mobile-logo" onClick={() => navigate('/home')}>
                    <span className="accent">DP</span> DailyPay
                </div>
                <div className="header-search">
                    <Search size={20} className="search-icon" />
                    <input type="text" placeholder="Search transactions, organizations..." />
                </div>

                <div className="header-actions">
                    <button className="icon-btn">
                        <Bell size={20} />
                        <span className="badge"></span>
                    </button>

                    <button
                        className="mobile-menu-btn icon-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role === 'employee' ? 'Nepal Government Employee' : 'Admin'}</span>
                        </div>
                        <div className="avatar">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt={user.name} />
                            ) : (
                                <User size={24} />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <div className="mobile-user-info">
                                <div className="avatar">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                                <div>
                                    <div className="user-name">{user?.name}</div>
                                    <div className="user-role">{user?.role === 'employee' ? 'Employee' : user?.role === 'org_admin' ? 'Organization Admin' : 'Administrator'}</div>
                                </div>
                            </div>
                        </div>

                        <nav className="mobile-nav">
                            {menuItems.map((item) => (
                                <button
                                    key={item.path}
                                    className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                    onClick={() => handleMenuClick(item.path)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
