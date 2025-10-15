import React, { useState, useEffect } from 'react';
import './OverlayEditor.css'; // assume we'll create modern styles here

export default function OverlayEditor({ overlays, loading, onCreate, onUpdate, onDelete, selected, onSelect }) {
  const empty = { type: 'text', text: 'New overlay', x: 10, y: 10, width: 160, height: 60, zIndex: 100 };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (selected) setForm(selected);
    else setForm(empty);
  }, [selected]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleCreate = async () => {
    const payload = { ...form };
    delete payload.id;
    const created = await onCreate(payload);
    onSelect(created);
  };

  const handleSave = async () => { if (!form.id) return; await onUpdate(form.id, form); };
  const handleDelete = async () => { if (!form.id) return; await onDelete(form.id); onSelect(null); setForm(empty); };

  return (
    <div className="editor-card">
      <h2 className="editor-title">Overlay Manager</h2>
      {loading ? <p className="loading-text">Loading...</p> : (
        <>
          <div className="editor-section">
            <label>Type</label>
            <select value={form.type} onChange={e => handleChange('type', e.target.value)}>
              <option value="text">Text</option>
              <option value="image">Image (URL)</option>
            </select>
          </div>

          {form.type === 'text' ? (
            <div className="editor-section">
              <label>Text</label>
              <input value={form.text || ''} onChange={e => handleChange('text', e.target.value)} />
            </div>
          ) : (
            <div className="editor-section">
              <label>Image URL</label>
              <input value={form.src || ''} onChange={e => handleChange('src', e.target.value)} placeholder="https://..." />
            </div>
          )}

          <div className="editor-section grid-xy">
            <div>
              <label>X</label>
              <input type="number" value={form.x || 0} onChange={e => handleChange('x', Number(e.target.value))} />
            </div>
            <div>
              <label>Y</label>
              <input type="number" value={form.y || 0} onChange={e => handleChange('y', Number(e.target.value))} />
            </div>
          </div>

          <div className="editor-section grid-xy">
            <div>
              <label>Width</label>
              <input type="number" value={form.width || 0} onChange={e => handleChange('width', Number(e.target.value))} />
            </div>
            <div>
              <label>Height</label>
              <input type="number" value={form.height || 0} onChange={e => handleChange('height', Number(e.target.value))} />
            </div>
          </div>

          <div className="editor-section">
            <label>Z-index</label>
            <input type="number" value={form.zIndex || 0} onChange={e => handleChange('zIndex', Number(e.target.value))} />
          </div>

          <div className="editor-actions">
            {!form.id ? (
              <button className="btn btn-create" onClick={handleCreate}>Create Overlay</button>
            ) : (
              <>
                <button className="btn btn-save" onClick={handleSave}>Save</button>
                <button className="btn btn-delete" onClick={handleDelete}>Delete</button>
              </>
            )}
          </div>

          <div className="list-section">
            <h3>Saved Overlays</h3>
            {overlays.length === 0 ? <p>No overlays yet</p> : (
              <ul className="overlay-list">
                {overlays.map(o => (
                  <li key={o.id}>
                    <button className={`overlay-item ${selected?.id === o.id ? 'selected' : ''}`} onClick={() => onSelect(o)}>
                      {o.type === 'text' ? (o.text || 'Text') : (o.src || 'Image')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
