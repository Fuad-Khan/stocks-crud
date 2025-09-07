import React, { useState, useEffect } from "react";
import {
  fetchStocks,
  updateStock,
  deleteStock,
  createStock,
  fetchTradeCodes,
} from "./api";
import StockTable from "./components/StockTable";
import StockChart from "./components/StockChart";
import "./App.css";

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [tradeCode, setTradeCode] = useState("");
  const [codes, setCodes] = useState([]);
  const [showVolume, setShowVolume] = useState(true);

  // pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  // form for new row
  const [newStock, setNewStock] = useState({
    date: "",
    trade_code: "",
    open: "",
    high: "",
    low: "",
    close: "",
    volume: "",
  });

  // load data from backend
  async function load(code = null, pageNum = page, perPage = limit) {
    const skip = pageNum * perPage;
    const data = await fetchStocks(code, skip, perPage);
    setStocks(data);
    const distinct = [...new Set(data.map((d) => d.trade_code))];
    setCodes(distinct);
  }

  useEffect(() => {
    load(tradeCode, page, limit);
    fetchTradeCodes().then(setCodes);
  }, [page, tradeCode, limit]);

  // handlers
  async function onUpdate(id, payload) {
    await updateStock(id, payload);
    await load(tradeCode, page, limit);
  }

  async function onDelete(id) {
    await deleteStock(id);
    await load(tradeCode, page, limit);
  }

  async function onAdd() {
    if (!newStock.date || !newStock.trade_code) {
      alert("Date and Trade Code are required");
      return;
    }
    const payload = {
      date: newStock.date,
      trade_code: newStock.trade_code,
      open: newStock.open === "" ? null : Number(newStock.open),
      high: newStock.high === "" ? null : Number(newStock.high),
      low: newStock.low === "" ? null : Number(newStock.low),
      close: newStock.close === "" ? null : Number(newStock.close),
      volume: newStock.volume === "" ? null : Number(newStock.volume),
    };
    await createStock(payload);
    setNewStock({
      date: "",
      trade_code: "",
      open: "",
      high: "",
      low: "",
      close: "",
      volume: "",
    });
    await load(tradeCode, page, limit);
  }

  async function onSelectCode(e) {
    const c = e.target.value;
    setTradeCode(c);
    setPage(0); // reset to first page when filter changes
  }

  return (
    <div className="container">
      <h2>Stocks CRUD — simple demo</h2>

      {/* Add new row form */}
      <div className="add-form">
        <h3>Add New Stock</h3>
        <input
          type="date"
          value={newStock.date}
          onChange={(e) => setNewStock({ ...newStock, date: e.target.value })}
        />
        <input
          placeholder="Trade Code"
          value={newStock.trade_code}
          onChange={(e) =>
            setNewStock({ ...newStock, trade_code: e.target.value })
          }
        />
        <input
          placeholder="Open"
          value={newStock.open}
          onChange={(e) => setNewStock({ ...newStock, open: e.target.value })}
        />
        <input
          placeholder="High"
          value={newStock.high}
          onChange={(e) => setNewStock({ ...newStock, high: e.target.value })}
        />
        <input
          placeholder="Low"
          value={newStock.low}
          onChange={(e) => setNewStock({ ...newStock, low: e.target.value })}
        />
        <input
          placeholder="Close"
          value={newStock.close}
          onChange={(e) => setNewStock({ ...newStock, close: e.target.value })}
        />
        <input
          placeholder="Volume"
          value={newStock.volume}
          onChange={(e) => setNewStock({ ...newStock, volume: e.target.value })}
        />
        <button onClick={onAdd}>Add</button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <label>Filter trade_code: </label>
        <select value={tradeCode} onChange={onSelectCode}>
          <option value="">-- all --</option>
          {codes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={showVolume}
            onChange={(e) => setShowVolume(e.target.checked)}
          />
          Show volume in chart
        </label>
      </div>

{/* Chart */}
<div className="chart-container">
  <StockChart data={stocks} showVolume={showVolume} />
</div>

{/* Table */}
<StockTable stocks={stocks} onUpdate={onUpdate} onDelete={onDelete} />


      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={stocks.length < limit}
        >
          Next
        </button>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>
    </div>
  );
}
