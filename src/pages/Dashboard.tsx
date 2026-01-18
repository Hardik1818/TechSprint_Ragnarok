
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CreditCard,
    History,
    ShieldCheck,
    Lock,
    Unlock,
    Wallet,
    CheckCircle2,
    CalendarDays
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Dashboard.css';
import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom Tooltip for Chart
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: 'var(--surface-light)',
                border: '1px solid var(--glass-border)',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
                <p className="label" style={{ marginBottom: '8px', fontWeight: 600 }}>{`Day ${label}`}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color, fontSize: '0.85rem', marginBottom: '4px' }}>
                        {entry.name}: Rs. {entry.value?.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const { user, transactions, loading, setUser } = useAppContext();
    const [lockPercentage, setLockPercentage] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.lockPercentage !== undefined) setLockPercentage(user.lockPercentage);
            if (user.isLocked !== undefined) setIsLocked(user.isLocked);
        }
    }, [user?.lockPercentage, user?.isLocked]);

    const handleLockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLocked) return;
        const newVal = parseInt(e.target.value);
        setLockPercentage(newVal);
        // Live update user preference if not locked
        if (user) {
            setUser({ ...user, lockPercentage: newVal });
        }
    };

    const handleConfirmLock = () => {
        if (lockPercentage === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to lock ${lockPercentage}% of your daily earnings?\n\n` +
            `• Locked Amount: Immutable until month-end.\n` +
            `• Release: Auto-release or Admin approval only.\n\n` +
            `Proceed?`
        );

        if (confirmed && user) {
            setIsLocked(true);
            setUser({ ...user, isLocked: true, lockPercentage });
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loader"></div>
                <p>Calculating your daily earnings...</p>
            </div>
        );
    }

    const earnedThisMonth = 32000; // Mock calculation
    const totalDays = 30;
    const currentDay = 16;
    const progress = (currentDay / totalDays) * 100;
    const dailyRate = user?.dailyRate || 2000;

    // Calculate Locked and Withdrawable
    const lockedAmount = Math.round(earnedThisMonth * (lockPercentage / 100));



    // Withdrawable = Earned - Withdrawn - Locked
    // logic: We assume Wallet Balance reflects (Earned - Withdrawn).
    const currentWalletBalance = user?.walletBalance || 0;
    const withdrawableBalance = Math.max(0, currentWalletBalance - lockedAmount);

    // Generate Chart Data
    const chartData = useMemo(() => {
        const data = [];
        let cumulativeEarned = 0;
        let cumulativeWithdrawn = 0;

        // Simple logic to distribute withdraws somewhat randomly for the chart
        // In a real app, this would come from the backend grouped by date
        const withdrawDays = [5, 12, 15];

        for (let day = 1; day <= currentDay; day++) {
            cumulativeEarned += dailyRate;

            // Simulate withdrawal on specific days
            let todaysWithdraw = 0;
            if (withdrawDays.includes(day)) {
                todaysWithdraw = 5000; // Mock withdrawal amount
                cumulativeWithdrawn += todaysWithdraw;
            }

            // Locked portion is a simple % of EARNED so far
            const currentLocked = Math.round(cumulativeEarned * (lockPercentage / 100));

            data.push({
                day: day,
                earned: cumulativeEarned,
                withdrawn: cumulativeWithdrawn,
                locked: currentLocked,
                // Net available visually
                available: Math.max(0, cumulativeEarned - cumulativeWithdrawn - currentLocked)
            });
        }
        return data;
    }, [dailyRate, currentDay, lockPercentage]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="welcome">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Namaste, {user?.name?.split(' ')[0]}! 👋
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Here's your salary progress for this month.
                    </motion.p>
                </div>
                <div className="date-display">
                    <Clock size={16} />
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </header>

            <div className="stats-grid">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="stat-card balance-card"
                >
                    <div className="card-top">
                        <span className="label">Withdrawable Balance</span>
                        <div className="icon-box"><Wallet size={20} /></div>
                    </div>
                    <div className="balance-amount">Rs. {withdrawableBalance.toLocaleString()}</div>
                    <div className="card-bottom">
                        {lockedAmount > 0 && (
                            <span className="trend" style={{ opacity: 0.9, fontSize: '0.8rem', color: isLocked ? 'var(--warning)' : 'inherit' }}>
                                <Lock size={12} style={{ marginRight: 4 }} />
                                Rs. {lockedAmount.toLocaleString()} {isLocked ? 'Locked' : 'Reserved'}
                            </span>
                        )}
                        {!lockedAmount && (
                            <span className="trend positive"><TrendingUp size={14} /> +Rs. {user?.dailyRate} today</span>
                        )}
                        <button className="withdraw-btn">Withdraw Now</button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="stat-card"
                    style={{ borderTop: isLocked ? '4px solid var(--success)' : '4px solid var(--primary)' }}
                >
                    <div className="card-top">
                        <span className="label">Auto-Lock Savings</span>
                        <div className="icon-box" style={{
                            background: isLocked ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 64, 129, 0.1)',
                            color: isLocked ? 'var(--success)' : '#ff4081'
                        }}>
                            {isLocked ? <CheckCircle2 size={20} /> : (lockPercentage > 0 ? <Lock size={20} /> : <Unlock size={20} />)}
                        </div>
                    </div>
                    <div className="amount" style={{ fontSize: '1.5rem', marginTop: 'auto' }}>
                        {lockPercentage}% <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>of earnings</span>
                    </div>

                    <div className="slider-container" style={{ marginTop: '16px' }}>
                        {isLocked ? (
                            <div className="locked-status">
                                <div className="progress-bar" style={{ height: 6 }}>
                                    <div className="progress-fill" style={{ width: '100%', background: 'var(--success)' }}></div>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'block', marginTop: 8 }}>
                                    Funds locked until month end
                                </span>
                            </div>
                        ) : (
                            <>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="5"
                                    value={lockPercentage}
                                    onChange={handleLockChange}
                                    className="lock-slider"
                                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    <span>0%</span>
                                    <span>50%</span>
                                </div>
                                {lockPercentage > 0 && (
                                    <button
                                        onClick={handleConfirmLock}
                                        style={{
                                            width: '100%',
                                            marginTop: 12,
                                            padding: '6px',
                                            fontSize: '0.8rem',
                                            background: 'var(--surface-light)',
                                            border: '1px solid var(--primary)',
                                            color: 'var(--primary)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer'
                                        }}>
                                        Lock Funds
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="stat-card"
                >
                    <div className="card-top">
                        <span className="label">Total Earned (this month)</span>
                        <div className="icon-box earned"><TrendingUp size={20} /></div>
                    </div>
                    <div className="amount">Rs. {earnedThisMonth.toLocaleString()}</div>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="progress-text">{currentDay} / {totalDays} days cycle</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="stat-card"
                >
                    <div className="card-top">
                        <span className="label">Monthly Salary</span>
                        <div className="icon-box salary"><CreditCard size={20} /></div>
                    </div>
                    <div className="amount">Rs. {user?.salary.toLocaleString()}</div>
                    <div className="stat-info">
                        Daily Access Rate: <strong>Rs. {user?.dailyRate}</strong>
                    </div>
                </motion.div>
            </div>

            {/* Financial Analytics Chart Section */}
            <motion.div
                className="financial-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h3>Financial Analytics</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Income vs Expenditure over time</p>
                    </div>
                    <div className="days-worked-badge" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <CalendarDays size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem' }}>
                            Days Worked: <strong>{currentDay}/{totalDays}</strong>
                        </span>
                    </div>
                </div>

                <div className="chart-container" style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorWithdrawn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorLocked" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00e676" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a0a0ab', fontSize: 12 }}
                                tickCount={7}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a0a0ab', fontSize: 12 }}
                                tickFormatter={(value) => `k${value / 1000}`}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            <Area
                                type="monotone"
                                dataKey="earned"
                                name="Earned"
                                stroke="#00d2ff"
                                fillOpacity={1}
                                fill="url(#colorEarned)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="withdrawn"
                                name="Withdrawn"
                                stroke="#ff4d4d"
                                fillOpacity={1}
                                fill="url(#colorWithdrawn)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="locked"
                                name="Locked"
                                stroke="#00e676"
                                fillOpacity={1}
                                fill="url(#colorLocked)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <div className="dashboard-content">
                <section className="transactions-section">
                    <div className="section-header">
                        <h3><History size={18} /> Recent Activity</h3>
                        <button className="view-all">View All</button>
                    </div>
                    <div className="transaction-list">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="transaction-item">
                                <div className={`tx-icon ${tx.type}`}>
                                    {tx.type === 'withdraw' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                </div>
                                <div className="tx-details">
                                    <span className="tx-desc">{tx.description}</span>
                                    <span className="tx-date">{new Date(tx.date).toLocaleDateString()}</span>
                                </div>
                                <div className={`tx-amount ${tx.type}`}>
                                    {tx.type === 'withdraw' ? '-' : '+'} Rs. {tx.amount}
                                </div>
                                <div className={`tx-status ${tx.status}`}>{tx.status}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="insights-section">
                    <h3>Financial Insights</h3>
                    <div className="insight-card">
                        <div className="insight-icon"><ShieldCheck size={24} /></div>
                        <div className="insight-text">
                            <h4>Low Interest Alternative</h4>
                            <p>You've saved roughly <strong>Rs. 450</strong> in interest this month by avoiding informal loans.</p>
                        </div>
                    </div>
                    <div className="insight-card glow">
                        <h4>Next Payout</h4>
                        <div className="payout-timer">
                            <strong>12h 45m</strong>
                            <span>until next Rs. {user?.dailyRate} credit</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
