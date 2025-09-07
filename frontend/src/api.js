const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function fetchStocks(trade_code = null, skip = 0, limit = 100) {
  const url = new URL(`${API}/stocks`);
  url.searchParams.append("skip", skip);
  url.searchParams.append("limit", limit);
  if (trade_code) url.searchParams.append("trade_code", trade_code);

  const res = await fetch(url.toString());
  return res.json();
}


export async function createStock(payload) {
  const res = await fetch(`${API}/stocks`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function updateStock(id, payload) {
  const res = await fetch(`${API}/stocks/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteStock(id) {
  const res = await fetch(`${API}/stocks/${id}`, { method: "DELETE" });
  return res.json();
}

export async function fetchTradeCodes() {
  const res = await fetch(`${API}/trade_codes`);
  return res.json();
}
