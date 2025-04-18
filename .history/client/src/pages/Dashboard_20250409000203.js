// client/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard', { 
          headers: { authorization: token } 
        });
        
        if (!response.data.portfolio) {
          throw new Error('Invalid data structure from server');
        }

        setUserData(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load portfolio data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotalBalance = () => {
    if (!userData?.portfolio) return 0;
    return Object.values(userData.portfolio).reduce((total, amount) => total + Number(amount), 0);
  };

  const totalBalance = calculateTotalBalance();

  const handleActionNavigation = (path) => {
    alert('Transaction requests must be approved by administration. Please contact support for urgent transactions.');
    navigate(path);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Portfolio...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {userData?.username || 'User'}</h1>
        <button className="logout-btn" onClick={() => navigate('/logout')}>
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <section className="balance-card">
          <div className="balance-content">
            <h2>Portfolio Value</h2>
            <div className="balance-amount">
              R {totalBalance.toLocaleString('en-ZA', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
            <div className="balance-subtext">Administration Managed Balance</div>
          </div>
        </section>

        <section className="actions-section">
          <button 
            className="action-btn primary" 
            onClick={() => handleActionNavigation('/buy')}
          >
            Request Deposit
          </button>
          <button 
            className="action-btn" 
            onClick={() => handleActionNavigation('/send')}
          >
            Request Transfer
          </button>
          <button 
            className="action-btn" 
            onClick={() => handleActionNavigation('/withdraw')}
          >
            Request Withdrawal
          </button>
        </section>

        <section className="assets-section">
          <h3 className="section-title">Managed Asset Holdings</h3>
          <div className="assets-grid">
            {userData?.portfolio && Object.entries(userData.portfolio).map(([asset, amount]) => (
              <div key={asset} className="asset-card">
                <div className="asset-header">
                  <img 
                    src={`/icons/${asset}.png`} 
                    alt={asset} 
                    className="asset-icon" 
                  />
                  <div className="asset-info">
                    <span className="asset-symbol">{asset.toUpperCase()}</span>
                    <span className="asset-name">{getAssetName(asset)}</span>
                  </div>
                </div>
                
                <div className="asset-details">
                  <div className="asset-amount">
                    <span className="label">Managed Balance:</span>
                    <span className="value">
                      R {Number(amount).toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="dashboard-footer">
        <p>Need assistance? <a href="mailto:omas7th@gmail.com">Contact Support</a></p>
        <p className="disclaimer">All balance modifications require administrative approval</p>
      </footer>
    </div>
  );
};

const getAssetName = (symbol) => {
  const names = {
    zar: 'South African Rand',
    btc: 'Bitcoin',
    eth: 'Ethereum',
    usdt: 'Tether',
    xrp: 'XRP'
  };
  return names[symbol.toLowerCase()] || 'Digital Asset';
};

export default Dashboard;