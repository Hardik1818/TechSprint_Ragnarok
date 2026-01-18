import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    ArrowRight,
    Eye,
    EyeOff,
    User as UserIcon,
    Building,
    ShieldCheck
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAppContext();

    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') || 'employee';

    const [role, setRole] = useState(initialRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialRole) setRole(initialRole);
    }, [initialRole]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock Authentication Logic
        setTimeout(() => {
            let mockUser;
            if (role === 'employee') {
                mockUser = {
                    id: '1',
                    name: 'Abhi Poudel',
                    email: email || 'abhi@example.com',
                    role: 'employee',
                    organizationId: 'org1',
                    salary: 60000,
                    dailyRate: 2000,
                    walletBalance: 4000,
                    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abhi'
                };
                navigate('/dashboard');
            } else if (role === 'org') {
                mockUser = {
                    id: 'org_admin_1',
                    name: 'Nabil Bank HR',
                    email: email || 'hr@nabil.com',
                    role: 'org_admin',
                    organizationId: 'org1',
                    salary: 0,
                    dailyRate: 0,
                    walletBalance: 1200000,
                };
                navigate('/organization');
            } else {
                mockUser = {
                    id: 'admin_1',
                    name: 'Nepal Regulatory Authority',
                    email: email || 'regulator@gov.np',
                    role: 'admin',
                    salary: 0,
                    dailyRate: 0,
                    walletBalance: 0,
                };
                navigate('/regulatory');
            }

            setUser(mockUser as any);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="login-container">
            <div className="login-side-visual">
                <div className="visual-content">
                    <div className="logo-white" onClick={() => navigate('/home')}>
                        <div className="white-icon">DP</div>
                        <span>DailyPay Nepal</span>
                    </div>
                    <div className="branding">
                        <h2>Welcome back to <br /><span className="blue">Financial Freedom.</span></h2>
                        <p>Your daily salary streaming platform. Secure, transparent, and regulated.</p>
                    </div>
                </div>
                <div className="bg-patterns">
                    <div className="circle c1"></div>
                    <div className="circle c2"></div>
                </div>
            </div>

            <div className="login-form-side">
                <motion.div
                    className="login-box"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <header className="login-header">
                        <h1>Login</h1>
                        <p>Access your portal with your credentials</p>
                    </header>

                    <div className="role-switcher">
                        <button
                            className={role === 'employee' ? 'active' : ''}
                            onClick={() => setRole('employee')}
                        >
                            <UserIcon size={18} /> Employee
                        </button>
                        <button
                            className={role === 'org' ? 'active' : ''}
                            onClick={() => setRole('org')}
                        >
                            <Building size={18} /> Organization
                        </button>
                        <button
                            className={role === 'admin' ? 'active' : ''}
                            onClick={() => setRole('admin')}
                        >
                            <ShieldCheck size={18} /> Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-affix">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-affix">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>Log in to Portal <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <p className="register-link">
                        {role === 'employee' ?
                            "Organization not on DailyPay? " :
                            "Want to join DailyPay Org? "}
                        <a href="#">Contact Support</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
