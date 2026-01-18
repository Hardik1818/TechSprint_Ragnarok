import { useState } from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    Search,
    Plus
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import WithdrawModal from '../components/WithdrawModal';
import './Wallet.css';

const Wallet = () => {
    const { user, transactions } = useAppContext();
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'all') return true;
        return tx.type === filter;
    });

    return (
        <div className="wallet-container animate-fadeIn">
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
                        <span className="s-value positive">+Rs. 32,000</span>
                    </div>
                    <div className="stat-item">
                        <div className="divider"></div>
                    </div>
                    <div className="stat-item">
                        <span className="s-label">Withdrawals</span>
                        <span className="s-value negative">-Rs. 5,400</span>
                    </div>
                </div>
            </div>

            <div className="wallet-grid">
                <div className="wallet-main">
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
                                        {tx.type === 'withdraw' ? '-' : '+'} Rs. {tx.amount}
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
            </div>
        </div>
    );
};

export default Wallet;
