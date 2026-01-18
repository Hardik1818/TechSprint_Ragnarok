import { useState } from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    Search,
    Plus,
    Smartphone,
    Wifi,
    Tv,
    Droplets,
    Zap,
    Landmark,
    ChevronDown,
    ChevronUp,
    Plane,
    Bus,
    Ticket,
    Clapperboard,
    Calendar,
    Vote,
    MapPin,
    Gamepad2,
    Music,
    TramFront
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import WithdrawModal from '../components/WithdrawModal';
import ServicePaymentModal from '../components/ServicePaymentModal';
import './Wallet.css';

const Wallet = () => {
    const { user, transactions } = useAppContext();
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isServicesExpanded, setIsServicesExpanded] = useState(false);
    const [activeService, setActiveService] = useState<{ name: string, icon: React.ReactNode } | null>(null);

    const handleServiceClick = (name: string, icon: React.ReactNode) => {
        setActiveService({ name, icon });
    };

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'all') return true;
        return tx.type === filter;
    });

    return (
        <div className="wallet-container animate-fadeIn">
            {/* Header and Balance Bar sections remain unchanged */}
            <header className="page-header wallet-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1>My Wallet</h1>
                        <button className="btn-primary compact" onClick={() => setIsModalOpen(true)}>
                            <Plus size={16} /> Transfer Funds
                        </button>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary compact"><Download size={16} /> Statement</button>
                </div>
            </header>

            <div className="sticky-balance-bar">
                <div className="balance-main">
                    <span className="label">Available Balance</span>
                    <h2 className="amount">Rs. {user?.walletBalance.toLocaleString()}</h2>
                </div>
                <div className="balance-stats">
                    <div className="stat-item">
                        <span className="s-label">This Month</span>
                        <span className="s-value positive">+Rs. {transactions
                            .filter(t => t.type === 'daily_credit' && new Date(t.date).getMonth() === new Date().getMonth())
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString()}
                        </span>
                    </div>
                    <div className="stat-item">
                        <div className="divider"></div>
                    </div>
                    <div className="stat-item">
                        <span className="s-label">Withdrawals</span>
                        <span className="s-value negative">-Rs. {transactions
                            .filter(t => t.type === 'withdraw' && new Date(t.date).getMonth() === new Date().getMonth())
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="wallet-grid">
                <div className="wallet-main">
                    {/* Services Grid Section */}
                    <div className="services-section">
                        <h3>Recharge & Bill Payments</h3>
                        <div className="services-grid">
                            <div className="service-item" onClick={() => handleServiceClick('Topup', <Smartphone size={24} />)}>
                                <div className="service-icon"><Smartphone size={24} /></div>
                                <span className="service-label">Topup</span>
                            </div>
                            <div className="service-item" onClick={() => handleServiceClick('Data/Voice Pack', <Wifi size={24} />)}>
                                <div className="service-icon"><Wifi size={24} /></div>
                                <span className="service-label">Data/Voice Pack</span>
                            </div>
                            <div className="service-item" onClick={() => handleServiceClick('Internet/TV', <Tv size={24} />)}>
                                <div className="service-icon"><Tv size={24} /></div>
                                <span className="service-label">Internet/TV</span>
                            </div>
                            <div className="service-item" onClick={() => handleServiceClick('Electricity', <Zap size={24} />)}>
                                <div className="service-icon"><Zap size={24} /></div>
                                <span className="service-label">Electricity</span>
                            </div>
                            <div className="service-item" onClick={() => handleServiceClick('Khanepani', <Droplets size={24} />)}>
                                <div className="service-icon"><Droplets size={24} /></div>
                                <span className="service-label">Khanepani</span>
                            </div>
                            <div className="service-item" onClick={() => handleServiceClick('Govt. Services', <Landmark size={24} />)}>
                                <div className="service-icon"><Landmark size={24} /></div>
                                <span className="service-label">Govt. Services</span>
                            </div>
                            <div className="service-item" onClick={() => handleServiceClick('Flight', <Plane size={24} />)}>
                                <div className="service-icon"><Plane size={24} /></div>
                                <span className="service-label">Flight</span>
                            </div>

                            <div className="service-item" onClick={() => setIsServicesExpanded(!isServicesExpanded)}>
                                <div className="service-icon">
                                    {isServicesExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>
                                <span className="service-label">{isServicesExpanded ? 'Show Less' : 'View All'}</span>
                            </div>
                        </div>

                        {/* Expanded Services */}
                        {isServicesExpanded && (
                            <div className="expanded-services animate-fadeIn">
                                <div className="service-category">
                                    <h4>Travel & Adventure</h4>
                                    <div className="services-grid">
                                        <div className="service-item" onClick={() => handleServiceClick('Intl Flight', <Plane size={24} />)}>
                                            <div className="service-icon"><Plane size={24} /></div>
                                            <span className="service-label">Int'l Flight</span>
                                        </div>
                                        <div className="service-item" onClick={() => handleServiceClick('Bus Ticket', <Bus size={24} />)}>
                                            <div className="service-icon"><Bus size={24} /></div>
                                            <span className="service-label">Bus Ticket</span>
                                        </div>
                                        <div className="service-item" onClick={() => handleServiceClick('Cable Car', <TramFront size={24} />)}>
                                            <div className="service-icon"><TramFront size={24} /></div>
                                            <span className="service-label">Cable Car</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="service-category">
                                    <h4>Entertainment & Lifestyle</h4>
                                    <div className="services-grid">
                                        <div className="service-item" onClick={() => handleServiceClick('Movie', <Clapperboard size={24} />)}>
                                            <div className="service-icon"><Clapperboard size={24} /></div>
                                            <span className="service-label">Movie</span>
                                        </div>
                                        <div className="service-item" onClick={() => handleServiceClick('Events', <Calendar size={24} />)}>
                                            <div className="service-icon"><Calendar size={24} /></div>
                                            <span className="service-label">Events</span>
                                        </div>
                                        <div className="service-item" onClick={() => handleServiceClick('Registration', <Ticket size={24} />)}>
                                            <div className="service-icon"><Ticket size={24} /></div>
                                            <span className="service-label">Registration</span>
                                        </div>
                                        <div className="service-item" onClick={() => handleServiceClick('Voting', <Vote size={24} />)}>
                                            <div className="service-icon"><Vote size={24} /></div>
                                            <span className="service-label">Voting</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="service-category">
                                    <div className="services-grid">
                                        <div className="service-item" onClick={() => handleServiceClick('Places', <MapPin size={24} />)}>
                                            <div className="service-icon"><MapPin size={24} /></div>
                                            <span className="service-label">Places</span>
                                        </div>
                                        <div className="service-item" onClick={() => handleServiceClick('Quiz', <Gamepad2 size={24} />)}>
                                            <div className="service-icon"><Gamepad2 size={24} /></div>
                                            <span className="service-label">Quiz</span>
                                        </div>
                                        <div className="service-item" onClick={() => handleServiceClick('Music', <Music size={24} />)}>
                                            <div className="service-icon"><Music size={24} /></div>
                                            <span className="service-label">Music</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="transaction-history">
                        <div className="history-header">
                            <h3>Transaction History</h3>
                            <div className="history-filters">
                                <div className="search-box">
                                    <Search size={16} />
                                    <input type="text" placeholder="Search..." />
                                </div>
                                <div className="filter-select">
                                    <Filter size={16} />
                                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="daily_credit">Earnings</option>
                                        <option value="withdraw">Withdrawals</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="history-list">
                            {filteredTransactions.map(tx => (
                                <div key={tx.id} className="tx-row">
                                    <div className={`tx-icon ${tx.type}`}>
                                        {tx.type === 'withdraw' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                    </div>
                                    <div className="tx-info">
                                        <div className="tx-name">{tx.description}</div>
                                        <div className="tx-meta">{new Date(tx.date).toLocaleString()} • {tx.type === 'daily_credit' ? 'Salary Credit' : 'Bank Transfer'}</div>
                                    </div>
                                    <div className={`tx-amt ${tx.type}`}>
                                        {tx.type === 'withdraw' ? '-' : '+'} Rs. {tx.amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="wallet-side">
                    <div className="side-card">
                        <h4>Quick Transfer</h4>
                        <div className="transfer-icons">
                            {['ES', 'KH', 'IM', 'BK'].map(i => (
                                <div key={i} className="t-icon">{i}</div>
                            ))}
                        </div>
                        <p>Connect your eSewa, Khalti, or Bank account for instant transfers.</p>
                        <button className="btn-outline">Link Account</button>
                    </div>

                    <div className="side-card">
                        <h4>Spending Analysis</h4>
                        <div className="chart-placeholder">
                            <div className="bar" style={{ height: '40%' }}></div>
                            <div className="bar" style={{ height: '70%' }}></div>
                            <div className="bar" style={{ height: '50%' }}></div>
                            <div className="bar" style={{ height: '90%' }}></div>
                            <div className="bar" style={{ height: '60%' }}></div>
                        </div>
                        <div className="analysis-text">
                            <p>Your spending is <strong>12% lower</strong> than last month. Good job!</p>
                        </div>
                    </div>
                </div>

                <WithdrawModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                {activeService && (
                    <ServicePaymentModal
                        isOpen={!!activeService}
                        onClose={() => setActiveService(null)}
                        serviceName={activeService.name}
                        serviceIcon={activeService.icon}
                    />
                )}
            </div>
        </div>
    );
};

export default Wallet;
