import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../stores/settingsStore';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { soundEnabled, soundVolume, toggleSound, setSoundVolume } = useSettingsStore();

  return (
    <div className="settings-page" style={{ padding: '24px' }}>
      <div className="page-header">
        <h1>⚙️ Тохиргоо</h1>
        <button className="back-btn glass-button" onClick={() => navigate(-1)}>
          Буцах
        </button>
      </div>
      <div className="glass-card" style={{ padding: '32px', marginTop: '24px' }}>
        <h2 style={{ marginBottom: '24px' }}>Дууны тохиргоо</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={toggleSound}
              style={{ width: '20px', height: '20px' }}
            />
            <span>Дуут мэдэгдэл идэвхжүүлэх</span>
          </label>
        </div>

        {soundEnabled && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              🔊 Дууны түвшин: {Math.round(soundVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
