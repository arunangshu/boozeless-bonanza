import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const Settings: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { resetCounters, clearGameData } = useGame();

  const handleReset = () => {
    if (resetCounters(password)) {
      setError(null);
      setIsDialogOpen(false);
      setPassword('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleClearData = () => {
    if (clearGameData(password)) {
      setError(null);
      setIsResetDialogOpen(false);
      setPassword('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <button 
          onClick={() => setIsDialogOpen(true)}
          style={{ 
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            background: 'rgba(255, 0, 100, 0.7)',
            color: 'white',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Reset Game
        </button>
        <button 
          onClick={() => setIsResetDialogOpen(true)}
          style={{ 
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            background: 'rgba(255, 50, 50, 0.7)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Clear All Data
        </button>
      </div>

      {isDialogOpen && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{ 
            background: '#222',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
            border: '1px solid #444',
          }}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Reset Game Counters</h3>
            <p style={{ color: '#ccc' }}>Enter the admin password to reset all player counters:</p>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px',
                margin: '10px 0',
                background: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
              }}
              placeholder="Enter password"
            />
            {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                onClick={() => {
                  setIsDialogOpen(false);
                  setError(null);
                  setPassword('');
                }}
                style={{ 
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#444',
                  color: 'white',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleReset}
                style={{ 
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'rgba(255, 0, 100, 0.7)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isResetDialogOpen && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{ 
            background: '#222',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
            border: '1px solid #444',
          }}>
            <h3 style={{ color: '#ff5555', marginTop: 0 }}>⚠️ Clear All Game Data</h3>
            <p style={{ color: '#ccc' }}>This will delete all saved data and refresh the page. This action cannot be undone!</p>
            <p style={{ color: '#ccc' }}>Enter the admin password to continue:</p>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px',
                margin: '10px 0',
                background: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
              }}
              placeholder="Enter password"
            />
            {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                onClick={() => {
                  setIsResetDialogOpen(false);
                  setError(null);
                  setPassword('');
                }}
                style={{ 
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#444',
                  color: 'white',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleClearData}
                style={{ 
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'rgba(255, 50, 50, 0.7)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 