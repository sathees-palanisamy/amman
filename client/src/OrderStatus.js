import * as React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

axios.defaults.baseURL = "http://localhost:5001";

const formatCurrency = (v) => {
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return "₹ 0.00";
  return `₹ ${n.toFixed(2)}`;
};

const StatusAlert = ({ type, children }) => {
  const base =
    "p-3 rounded-md text-sm mb-4 flex items-start gap-3 border ";
  if (type === "success")
    return <div className={base + "bg-green-50 border-green-200 text-green-800"}>{children}</div>;
  if (type === "warn")
    return <div className={base + "bg-yellow-50 border-yellow-200 text-yellow-800"}>{children}</div>;
  if (type === "error")
    return <div className={base + "bg-red-50 border-red-200 text-red-800"}>{children}</div>;
  return null;
};

const OrderStatus = () => {
  const login = useSelector((s) => s.auth.login);

  const [name, setName] = React.useState("");
  const [data, setData] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (e) => {
      e && e.preventDefault();
      if (!name.trim()) {
        setStatus("warn");
        setData([]);
        return;
      }

      setLoading(true);
      setStatus("");
      setData([]);
      try {
        const res = await axios.post("/search", { name: name.trim() });
        if (res.status === 200 && Array.isArray(res.data.result) && res.data.result.length > 0) {
          setData(res.data.result);
          setStatus("success");
        } else {
          setData([]);
          setStatus("no-data");
        }
      } catch (err) {
        setData([]);
        setStatus("error");
      } finally {
        setLoading(false);
        setName("");
      }
    },
    [name]
  );

  const clear = React.useCallback(() => {
    setName("");
    setData([]);
    setStatus("");
  }, []);

  if (!login) return <Navigate to="/" replace />;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-orange-600 text-2xl font-extrabold">Order Search</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">Search orders by customer name</div>
      </header>

      <section className="bg-white dark:bg-gray-800 border border-orange-100 rounded-lg p-5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              type="button"
              onClick={clear}
              className="hidden md:inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-4">
          {status === "no-data" && (
            <StatusAlert type="warn">
              <strong className="font-semibold">No results.</strong>
              <span className="block text-gray-600">No orders found for the given name.</span>
            </StatusAlert>
          )}

          {status === "error" && (
            <StatusAlert type="error">
              <strong className="font-semibold">Server error.</strong>
              <span className="block text-gray-600">Unable to search orders — please try again later.</span>
            </StatusAlert>
          )}

          {status === "warn" && (
            <StatusAlert type="warn">
              <strong className="font-semibold">Enter a name.</strong>
              <span className="block text-gray-600">Please provide a name to search.</span>
            </StatusAlert>
          )}

          {status === "success" && (
            <StatusAlert type="success">
              <strong className="font-semibold">{data.length} result{data.length > 1 ? "s" : ""}</strong>
              <span className="block text-gray-600">Showing recent matches.</span>
            </StatusAlert>
          )}
        </div>

        {data.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Order #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Mobile</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((row) => (
                  <tr
                    key={row.orderid || `${row.phone}-${row.orderDate}`}
                    className="hover:bg-orange-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-gray-800">{row.orderDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-800">{formatCurrency(row.totalamt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-800 font-medium">{row.orderid}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-800">{row.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-800">{row.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={`/invoice/${row.orderid}`}
                          className="px-3 py-1 text-xs rounded-md bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && data.length === 0 && status !== "warn" && status !== "error" && (
          <div className="mt-4 text-center text-gray-600">No results to display.</div>
        )}
      </section>
    </div>
  );
};

export default OrderStatus;