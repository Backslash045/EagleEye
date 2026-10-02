import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUDIT_LOG } from '../data';

interface AuditRecord {
  id: string | number;
  timestamp: string;
  operator: string;
  role: string;
  action: string;
  plate: string;
  ip: string;
  status: string;
}

export default function AuditLog() {
  const [filterText, setFilterText] = useState('');

  let data = AUDIT_LOG as AuditRecord[];
  if (!data || data.length === 0) {
    data = Array.from({length: 20}, (_, i) => ({
      id: `LOG-${1000+i}`,
      timestamp: new Date(Date.now() - (i * 3600000 + i * 150000)).toISOString().replace('T', ' ').substring(0, 19),
      operator: i % 3 === 0 ? 'Alice Smith' : (i % 2 === 0 ? 'Bob Jones' : 'Charlie Davis'),
      role: i % 3 === 0 ? 'Admin' : (i % 2 === 0 ? 'Analyst' : 'Viewer'),
      action: ['Search Vehicle', 'Export Data', 'Flag Vehicle', 'Unflag Vehicle', 'View Profile'][i % 5],
      plate: ['WB 26 AE 7834', 'MH 12 AB 1234', 'KA 01 XY 9999', 'DL 4C AB 4321', '-'][i % 5],
      ip: `192.168.1.${10+i}`,
      status: i % 7 === 0 ? 'Denied' : 'Success'
    }));
  } else {
    data = data.slice(0, 20);
  }

  const filtered = data.filter(row => {
    if (!filterText) return true;
    return row.plate && row.plate.toLowerCase().includes(filterText.toLowerCase());
  });

  const getRoleBadge = (role: string) => {
    if (!role) return null;
    const r = role.toLowerCase();
    if (r === 'admin') return <span className="badge badge-info text-xs">Admin</span>;
    if (r === 'analyst') return <span className="badge badge-warning text-xs">Analyst</span>;
    return <span className="badge badge-neutral text-xs">Viewer</span>;
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'success' || s === 'granted' || s === 'active') return <span className="badge badge-success text-xs">Success</span>;
    if (s === 'denied' || s === 'failed' || s === 'error') return <span className="badge badge-danger text-xs">Denied</span>;
    return <span className="badge badge-neutral text-xs">{status}</span>;
  };

  const getActionClass = (action: string) => {
    const a = (action || '').toLowerCase();
    let color = 'text-primary';
    if (a.includes('flag')) color = 'text-danger';
    if (a.includes('export')) color = 'text-success';
    if (a.includes('search')) color = 'text-info';
    return `font-medium ${color}`;
  };

  const navigate = useNavigate();

  const handleTrajectory = (e: React.MouseEvent, plate: string) => {
    e.preventDefault();
    if (plate) {
      navigate(`/vehicle-tracking?plate=${plate}`);
    }
  };

  return (
    <div className="page">
      <div className="page-header flex justify-between items-center mb-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-header-title text-2xl font-bold">Audit Log</h1>
          <p className="text-secondary mt-4">Access & activity records</p>
        </div>
        <div className="flex gap-12 items-center">
          <div className="input-group flex gap-8" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="text" className="form-input" placeholder="Filter by date..." style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input 
              type="text" 
              id="plateFilterInput"
              className="form-input" 
              placeholder="Filter by plate..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
            <button id="filterBtn" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 1rem' }}>Filter</button>
          </div>
        </div>
      </div>

      <div className="card border rounded bg-white shadow-sm">
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="w-full text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <th className="p-12 text-sm font-semibold text-secondary" style={{ padding: '0.75rem' }}>Timestamp</th>
                <th className="p-12 text-sm font-semibold text-secondary" style={{ padding: '0.75rem' }}>Operator</th>
                <th className="p-12 text-sm font-semibold text-secondary" style={{ padding: '0.75rem' }}>Action</th>
                <th className="p-12 text-sm font-semibold text-secondary" style={{ padding: '0.75rem' }}>Plate Number</th>
                <th className="p-12 text-sm font-semibold text-secondary" style={{ padding: '0.75rem' }}>IP Address</th>
                <th className="p-12 text-sm font-semibold text-secondary" style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody id="auditTableBody">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-secondary" style={{ padding: '2rem' }}>
                    No records found matching "{filterText}"
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.2s' }}>
                    <td className="p-12 text-sm text-secondary" style={{ padding: '0.75rem' }}>{row.timestamp || 'N/A'}</td>
                    <td className="p-12" style={{ padding: '0.75rem' }}>
                      <div className="flex items-center gap-8" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="font-medium">{row.operator || 'Unknown'}</span>
                        {getRoleBadge(row.role)}
                      </div>
                    </td>
                    <td className="p-12" style={{ padding: '0.75rem' }}>
                      <span className={getActionClass(row.action)}>{row.action || 'Unknown'}</span>
                    </td>
                    <td className="p-12 mono font-medium" style={{ padding: '0.75rem', fontFamily: 'monospace' }}>
                      {row.plate !== '-' ? (
                        <a href="#" className="text-primary hover:underline plate-link" data-plate={row.plate} onClick={(e) => handleTrajectory(e, row.plate)}>
                          {row.plate}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="p-12 mono text-tertiary text-sm" style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{row.ip || '0.0.0.0'}</td>
                    <td className="p-12" style={{ padding: '0.75rem' }}>{getStatusBadge(row.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
        <div className="text-sm text-secondary">Showing all records</div>
        <div className="pagination flex gap-8" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="page-btn active btn btn-sm btn-primary" style={{ padding: '0.25rem 0.75rem' }}>1</button>
          <button className="page-btn btn btn-sm btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>2</button>
          <button className="page-btn btn btn-sm btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>3</button>
          <button className="page-btn btn btn-sm btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Next</button>
        </div>
      </div>
    </div>
  );
}
