
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, History, Calendar, Search, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './History.css';
import { useState } from 'react';

const TransactionHistory = () => {
    const { transactions } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="history-page animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>Transaction History</h1>
                    <p>View all your past streams and withdrawals</p>
                </div>
            </header>

            <div className="history-controls">
                <div className="search-box">
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <Filter size={16} />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="stream">Salary Streams</option>
                        <option value="withdraw">Withdrawals</option>
                    </select>
                </div>
            </div>

            <div className="history-list">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx, index) => (
                        <motion.div
                            key={tx.id}
                            className="history-item"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className={`tx-icon ${tx.type}`}>
                                {tx.type === 'withdraw' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                            </div>
                            <div className="tx-info">
                                <h4>{tx.description}</h4>
                                <span className="tx-meta">
                                    <Calendar size={12} /> {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="tx-amount-col">
                                <span className={`amount ${tx.type}`}>
                                    {tx.type === 'withdraw' ? '-' : '+'} Rs. {tx.amount.toLocaleString()}
                                </span>
                                <span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-state">
                        <History size={48} color="var(--glass-border)" />
                        <p>No transactions found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
