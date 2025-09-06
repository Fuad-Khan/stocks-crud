import React, { useState } from "react";


export default function StockTable({ stocks, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  function startEdit(s) {
    setEditingId(s.id);
    setForm({
      high: s.high ?? "",
      low: s.low ?? "",
      open: s.open ?? "",
      close: s.close ?? "",
      volume: s.volume ?? ""
    });
  }

  function cancel() {
    setEditingId(null);
    setForm({});
  }

  function save(id) {
    const payload = {
      high: form.high === "" ? null : Number(form.high),
      low: form.low === "" ? null : Number(form.low),
      open: form.open === "" ? null : Number(form.open),
      close: form.close === "" ? null : Number(form.close),
      volume: form.volume === "" ? null : Number(form.volume)
    };
    onUpdate(id, payload);
    cancel();
  }

  return (
    <table className="stock-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Trade Code</th>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Close</th>
          <th>Volume</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((s) => (
          <tr key={s.id}>
            <td>{s.date}</td>
            <td>{s.trade_code}</td>
            <td>
              {editingId === s.id ? (
                <input value={form.open} onChange={(e) => setForm({ ...form, open: e.target.value })} />
              ) : (
                s.open
              )}
            </td>
            <td>
              {editingId === s.id ? (
                <input value={form.high} onChange={(e) => setForm({ ...form, high: e.target.value })} />
              ) : (
                s.high
              )}
            </td>
            <td>
              {editingId === s.id ? (
                <input value={form.low} onChange={(e) => setForm({ ...form, low: e.target.value })} />
              ) : (
                s.low
              )}
            </td>
            <td>
              {editingId === s.id ? (
                <input value={form.close} onChange={(e) => setForm({ ...form, close: e.target.value })} />
              ) : (
                s.close
              )}
            </td>
            <td>
              {editingId === s.id ? (
                <input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} />
              ) : (
                s.volume?.toLocaleString?.() ?? s.volume
              )}
            </td>
            <td>
              {editingId === s.id ? (
                <>
                  <button className="save" onClick={() => save(s.id)}>Save</button>
                  <button className="cancel" onClick={cancel}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="edit" onClick={() => startEdit(s)}>Edit</button>
                  <button className="delete" onClick={() => onDelete(s.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
