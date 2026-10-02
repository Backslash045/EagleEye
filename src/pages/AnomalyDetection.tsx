import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANOMALY_DATABASE } from '../data';

interface AnomalyData {
  plate: string;
  vehicleType: string;
  make: string;
  color: string;
  registrationType: string;
  fuelType: string;
}

export default function AnomalyDetection() {
  const [inputs, setInputs] = useState<string[]>(Array(10).fill(''));
  const [results, setResults] = useState<AnomalyData[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<{ text: string, isError: boolean } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const getPreview = () => {
    const vals = inputs.map(v => v || '_');
    const state = vals.slice(0, 2).join('');
    const rto = vals.slice(2, 4).join('');
    const series = vals.slice(4, 6).join('');
    const number = vals.slice(6, 10).join('');
    return `${state} ${rto} ${series} ${number}`;
  };

  const handleInput = (index: number, val: string) => {
    let newVal = val.toUpperCase();
    if (index < 2 || (index >= 4 && index < 6)) {
      newVal = newVal.replace(/[^A-Z]/g, '');
    } else {
      newVal = newVal.replace(/[^0-9]/g, '');
    }

    const newInputs = [...inputs];
    newInputs[index] = newVal;
    setInputs(newInputs);

    if (newVal && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < 9) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    const vals = inputs.map(v => v || '.');
    
    if (vals.every(v => v === '.')) {
      setErrorMsg({ text: 'Please enter at least one character to search.', isError: false });
      setResults(null);
      return;
    }

    const regexStr = vals.join('');
    let regex: RegExp;
    try {
      regex = new RegExp(`^${regexStr}$`, 'i');
    } catch (e) {
      setErrorMsg({ text: 'Invalid search pattern.', isError: true });
      setResults(null);
      return;
    }

    const matches = ANOMALY_DATABASE.filter(v => {
      const plateNoSpaces = v.plate.replace(/\s+/g, '');
      return regex.test(plateNoSpaces);
    });

    if (matches.length === 0) {
      setErrorMsg({ text: 'No matching vehicles found. Try adjusting your search pattern.', isError: false });
      setResults(null);
      return;
    }

    setErrorMsg(null);
    setResults(matches);
  };

  const navigateToIntelligence = (plate: string) => {
    navigate(`/vehicle-intelligence?plate=${plate}`);
  };

  return (
    <div className="page">
      <style>{`
        .plate-box {
          width: 44px;
          height: 52px;
          text-align: center;
          font-size: 1.5rem;
          font-family: monospace;
          font-weight: bold;
          text-transform: uppercase;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          background: var(--bg-card);
          color: var(--text-primary);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .plate-box:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .space-divider { width: 12px; }
        .anomaly-result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
      
      <div className="page-header mb-20">
        <h1 className="page-header-title text-2xl font-bold">Anomaly Detection / Partial Plate Search</h1>
        <p className="text-secondary mt-8">Enter known parts of the vehicle plate. Leave boxes empty for unknown characters.</p>
      </div>

      <div className="card panel border rounded mb-20">
        <div className="card-body panel-body p-20 flex flex-col gap-16" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="text-sm text-secondary font-medium uppercase tracking-wider">Plate Segments</div>
          
          <div className="flex items-center flex-wrap" id="plateInputsContainer" style={{ display: 'flex', alignItems: 'center' }}>
            {inputs.map((val, idx) => (
              <React.Fragment key={idx}>
                <input
                  type="text"
                  className={`plate-box ${idx === 1 || idx === 3 || idx === 5 || idx === 7 || idx === 8 || idx === 9 ? 'ml-4' : ''}`}
                  style={idx === 1 || idx === 3 || idx === 5 || idx === 7 || idx === 8 || idx === 9 ? { marginLeft: '4px' } : {}}
                  maxLength={1}
                  data-index={idx}
                  placeholder="_"
                  value={val}
                  ref={el => { inputRefs.current[idx] = el; }}
                  onChange={e => handleInput(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  onFocus={e => e.target.select()}
                />
                {(idx === 1 || idx === 3 || idx === 5) && <div className="space-divider"></div>}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-8 border-t pt-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color, #e5e7eb)', paddingTop: '1rem' }}>
            <div className="text-lg font-medium">Live Preview: <span id="platePreview" className="mono text-primary font-bold tracking-widest ml-8" style={{ marginLeft: '0.5rem', letterSpacing: '0.1em' }}>{getPreview()}</span></div>
            <button id="searchPartialBtn" className="btn btn-primary" onClick={performSearch} style={{ padding: '10px 24px', fontWeight: 600, borderRadius: '8px' }}>Search Database</button>
          </div>
        </div>
      </div>

      <div className="results-container">
        <h3 className="text-lg font-semibold mb-12">Suggested Matches</h3>
        <div id="anomalyResultsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {errorMsg ? (
            <div className={errorMsg.isError ? "text-danger" : "text-secondary"} style={{ gridColumn: '1 / -1' }}>{errorMsg.text}</div>
          ) : results ? (
            results.map(m => (
              <div 
                key={m.plate} 
                className="card border rounded p-16 flex flex-col gap-8 anomaly-result-card" 
                data-plate={m.plate}
                onClick={() => navigateToIntelligence(m.plate)}
                style={{ border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-card)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              >
                <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="text-xl font-bold mono text-primary">{m.plate}</div>
                  <span className="badge badge-info text-xs">{m.registrationType || 'Personal'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div><span className="text-secondary text-xs uppercase">Type</span><br/><b>{m.vehicleType}</b></div>
                  <div><span className="text-secondary text-xs uppercase">Make</span><br/><b>{m.make}</b></div>
                  <div><span className="text-secondary text-xs uppercase">Color</span><br/><b>{m.color}</b></div>
                  <div><span className="text-secondary text-xs uppercase">Fuel</span><br/><b>{m.fuelType}</b></div>
                </div>
                <button className="btn btn-secondary btn-sm mt-8 w-full" style={{ marginTop: '8px', width: '100%' }}>View Intelligence &rarr;</button>
              </div>
            ))
          ) : (
            <div className="text-secondary" style={{ gridColumn: '1 / -1' }}>Enter a partial plate to search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
