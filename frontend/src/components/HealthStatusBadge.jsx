import React, { useState, useEffect } from 'react';
import { checkHealth, getApiBaseUrl } from '../services/apiService';
import { Activity, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

const HealthStatusBadge = ({ onStatusChange }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const [responseMsg, setResponseMsg] = useState('');
  const [lastPing, setLastPing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await checkHealth();
      setStatus('connected');
      setResponseMsg(data.status || 'Backend running');
      setLastPing(new Date().toLocaleTimeString());
      if (onStatusChange) onStatusChange({ connected: true, data });
    } catch (err) {
      setStatus('disconnected');
      setResponseMsg(err.message || 'Unable to connect');
      if (onStatusChange) onStatusChange({ connected: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Poll every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div
        className={`health-badge ${
          status === 'connected' ? 'connected' : 'disconnected'
        }`}
        title={`Backend URL: ${getApiBaseUrl()}/api/health\nMessage: ${responseMsg}\nLast Checked: ${lastPing || 'Just now'}`}
        onClick={fetchHealth}
      >
        <span className="status-dot"></span>
        <span>
          {status === 'checking' && 'Checking Backend...'}
          {status === 'connected' && 'Backend Connected'}
          {status === 'disconnected' && 'Backend Disconnected'}
        </span>
        <RefreshCw
          size={14}
          className={`ml-1 ${loading ? 'animate-spin opacity-80' : 'opacity-50 hover:opacity-100'}`}
        />
      </div>
    </div>
  );
};

export default HealthStatusBadge;
