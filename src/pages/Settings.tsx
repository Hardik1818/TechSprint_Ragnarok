import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Save,
    Lock,
    CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Settings.css';

const Settings = () => {
    const { user, requestUnlock, unlockRequests } = useAppContext();
    const [activeTab, setActiveTab] = useState('profile');
    const [reqStatus, setReqStatus] = useState<'idle' | 'success'>('idle');
    const isOrg = user?.role === 'org_admin';

    // Check if there is already a pending request for this user
    // In a real app we'd filter by user ID, but here we assume single user session perspective or simplified mock
    const myPendingRequest = unlockRequests.find(r => r.status === 'Pending' && r.employeeId === (user?.id || '1'));

    const handleRequest = () => {
        if (myPendingRequest) return;
        requestUnlock({
            employeeId: user?.id || '1',
            amount: 12500 // Mock amount for now
        });
        setReqStatus('success');
        setTimeout(() => setReqStatus('idle'), 3000);
    };

    return (
        <div className="settings-container animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>{isOrg ? 'Organization Settings' : 'Settings'}</h1>
                    <p>{isOrg ? 'Manage company details, payroll integration, and security.' : 'Manage your account preferences and security.'}</p>
                </div>
            </header>

            <div className="settings-layout">
                <aside className="settings-sidebar">
                    <button
                        className={`s-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={18} /> {isOrg ? 'Company Profile' : 'Profile'}
                    </button>

                    {isOrg ? (
                        <>
                            <button
                                className={`s-nav-item ${activeTab === 'funding' ? 'active' : ''}`}
                                onClick={() => setActiveTab('funding')}
                            >
                                <CreditCard size={18} /> Funding Account
                            </button>
                            <button
                                className={`s-nav-item ${activeTab === 'integration' ? 'active' : ''}`}
                                onClick={() => setActiveTab('integration')}
                            >
                                <Save size={18} /> HRIS Integration
                            </button>
                        </>
                    ) : (
                        <button
                            className={`s-nav-item ${activeTab === 'payment' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payment')}
                        >
                            <CreditCard size={18} /> Payment Methods
                        </button>
                    )}

                    <button
                        className={`s-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} /> Notifications
                    </button>

                    <button
                        className={`s-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <Shield size={18} /> Security
                    </button>
                </aside>

                <main className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-card">
                            <h3>{isOrg ? 'Organization Details' : 'Personal Information'}</h3>
                            <div className="profile-header">
                                <div className="profile-avatar-lg">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} />
                                    ) : (
                                        <User size={40} />
                                    )}
                                </div>
                                <div>
                                    <button className="btn-outline-sm">{isOrg ? 'Update Logo' : 'Change Photo'}</button>
                                </div>
                            </div>

                            <form className="settings-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{isOrg ? 'Company Name' : 'Full Name'}</label>
                                        <input type="text" defaultValue={user?.name} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" defaultValue={user?.email} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{isOrg ? 'Support Contact' : 'Phone Number'}</label>
                                        <input type="tel" defaultValue={isOrg ? '+977 1-4000000' : '+977 9800000000'} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isOrg ? 'Registration PAN/VAT' : 'Organization'}</label>
                                        <input type="text" defaultValue={isOrg ? '600012345' : 'Nabil Bank'} disabled={!isOrg} />
                                    </div>
                                </div>
                                <button className="btn-primary">Save Changes</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'payment' && !isOrg && (
                        <div className="settings-card">
                            <h3>Salary Unlock Request</h3>
                            <p className="desc">Request to unlock your accrued daily salary for withdrawal.</p>

                            <div className="unlock-section" style={{ background: 'var(--surface-light)', padding: '20px', borderRadius: '12px', marginBottom: '32px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Lock size={14} /> Accrued & Locked
                                        </p>
                                        <h2 style={{ color: 'var(--text)', marginTop: 4 }}>NPR 12,500</h2>
                                    </div>

                                    {myPendingRequest ? (
                                        <div style={{ textAlign: 'right' }}>
                                            <span className="status-pill warning">Request Pending</span>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Admin review in progress</p>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-primary"
                                            onClick={handleRequest}
                                            disabled={reqStatus === 'success'}
                                        >
                                            {reqStatus === 'success' ? <><CheckCircle2 size={18} /> Sent</> : 'Request Unlock'}
                                        </button>
                                    )}
                                </div>
                                {reqStatus === 'success' && (
                                    <div style={{ marginTop: 12, color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <CheckCircle2 size={14} /> Request sent successfully!
                                    </div>
                                )}
                            </div>

                            <h3>Linked Accounts</h3>
                            <p className="desc">Manage where you receive your daily salary.</p>

                            <div className="linked-accounts">
                                <div className="account-item">
                                    <div className="ac-icon bank"><LandmarkIconWrapper /></div>
                                    <div className="ac-info">
                                        <strong>Nabil Bank</strong>
                                        <span>**** 1234 • Primary</span>
                                    </div>
                                    <button className="text-btn red">Remove</button>
                                </div>

                                <div className="account-item">
                                    <div className="ac-icon esewa">e</div>
                                    <div className="ac-info">
                                        <strong>eSewa Wallet</strong>
                                        <span>9841******</span>
                                    </div>
                                    <button className="text-btn red">Remove</button>
                                </div>
                            </div>

                            <button className="btn-outline-dashed">+ Add New Method</button>
                        </div>
                    )}

                    {activeTab === 'funding' && isOrg && (
                        <div className="settings-card">
                            <h3>Funding Source</h3>
                            <p className="desc">Primary account used for salary disbursement and daily accruals.</p>
                            <div className="account-item">
                                <div className="ac-icon bank"><LandmarkIconWrapper /></div>
                                <div className="ac-info">
                                    <strong>Nabil Bank Corporate</strong>
                                    <span>AC: 010101****5500 • Active</span>
                                </div>
                                <span className="status-pill active" style={{ color: '#00e676', background: 'rgba(0,230,118,0.1)' }}>Connected</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integration' && isOrg && (
                        <div className="settings-card">
                            <h3>HRIS Integration</h3>
                            <p className="desc">Connect with your HR software to auto-sync employee data.</p>
                            <div className="linked-accounts">
                                <div className="account-item">
                                    <div className="ac-icon" style={{ background: '#fff', color: '#000' }}>B</div>
                                    <div className="ac-info">
                                        <strong>BambooHR</strong>
                                        <span>Last Sync: 2 mins ago</span>
                                    </div>
                                    <button className="text-btn">Sync Now</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-card">
                            <h3>Notification Preferences</h3>
                            <div className="switch-group">
                                <div className="switch-label">
                                    <strong>Email Alerts</strong>
                                    <p>Receive daily summaries of {isOrg ? 'disbursements' : 'your earnings'}.</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="switch-group">
                                <div className="switch-label">
                                    <strong>SMS Notifications</strong>
                                    <p>Get instant alerts for {isOrg ? 'low balance' : 'withdrawals'}.</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-card">
                            <h3>Security Settings</h3>
                            <button className="btn-outline">Change Password</button>
                            <br /><br />
                            <div className="security-alert">
                                <Shield size={20} />
                                <span>Two-Factor Authentication is currently <strong>Enabled</strong>.</span>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Helper for icon since we removed Landmark import previously to avoid lints
const LandmarkIconWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" /><line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" /></svg>
);

export default Settings;
