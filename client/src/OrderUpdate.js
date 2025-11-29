import * as React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { ToWords } from "to-words";
import formUrl from "./GSTin Invoice.pdf";
import { useSelector } from "react-redux";

axios.defaults.baseURL = "http://localhost:5001";

const safeFloat = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const StatusBadge = ({ type, children }) => {
  const base = "p-3 rounded-md text-sm mb-4 flex items-start gap-3 border ";
  if (type === "success") return <div className={base + "bg-green-50 border-green-200 text-green-800"}>{children}</div>;
  if (type === "warn") return <div className={base + "bg-yellow-50 border-yellow-200 text-yellow-800"}>{children}</div>;
  if (type === "error") return <div className={base + "bg-red-50 border-red-200 text-red-800"}>{children}</div>;
  return null;
};

const ItemRow = React.memo(function ItemRow({ row, onChange, onRemove, disableRemove, disableSubmit }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 border border-orange-100 rounded-lg p-4 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
      {/* Particular (spans 2 columns on desktop) */}
      <div className="md:col-span-1">
        <label htmlFor={`particular-${row.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Particular
        </label>
        <input
          id={`particular-${row.id}`}
          type="text"
          value={row.particular}
          onChange={(e) => onChange(row.id, "particular", e.target.value)}
          disabled={disableSubmit}
          placeholder="Particular"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Copies */}
      <div>
        <label htmlFor={`book-${row.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Copies
        </label>
        <input
          id={`book-${row.id}`}
          type="number"
          inputMode="numeric"
          min="0"
          value={row.book}
          onChange={(e) => onChange(row.id, "book", e.target.value)}
          disabled={disableSubmit}
          placeholder="0"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Rate */}
      <div>
        <label htmlFor={`rate-${row.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Rate
        </label>
        <input
          id={`rate-${row.id}`}
          type="number"
          step="0.01"
          inputMode="decimal"
          min="0"
          value={row.rate}
          onChange={(e) => onChange(row.id, "rate", e.target.value)}
          disabled={disableSubmit}
          placeholder="0.00"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Amount (centered) */}
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">Amount</div>
        <div className="font-medium text-gray-800 dark:text-gray-100">₹ {(safeFloat(row.book) * safeFloat(row.rate)).toFixed(2)}</div>
      </div>

      {/* Remove button (aligned right) */}
      <div className="flex justify-end">
        <button
          onClick={(e) => { e.preventDefault(); onRemove(row.id); }}
          disabled={disableRemove || disableSubmit}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
          title="Remove row"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

const OrderUpdate = () => {
  const login = useSelector((s) => s.auth.login);

  const [searchOrderId, setSearchOrderId] = React.useState("");
  const [enableForm, setEnableForm] = React.useState(false);

  const idRef = React.useRef(1);
  const [rows, setRows] = React.useState([{ id: idRef.current++, particular: "", book: "", rate: "" }]);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gst, setGst] = React.useState("");
  const [code, setCode] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [orderId, setOrderId] = React.useState("");
  const [noOfCopies, setNoOfCopies] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [pendingAmount, setPendingAmount] = React.useState(0);

  const [disableSubmit, setDisableSubmit] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [searchStatus, setSearchStatus] = React.useState("");
  const [queryData, setQueryData] = React.useState({});

  const addRow = React.useCallback((e) => {
    e && e.preventDefault();
    if (rows.length >= 9) return;
    setRows((p) => [...p, { id: idRef.current++, particular: "", book: "", rate: "" }]);
  }, [rows.length]);

  const removeRow = React.useCallback((id) => {
    setRows((p) => p.filter((r) => r.id !== id));
  }, []);

  const updateRow = React.useCallback((id, field, value) => {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  React.useEffect(() => {
    // recompute totals whenever rows change
    const copies = rows.reduce((s, r) => s + safeFloat(r.book), 0);
    const total = rows.reduce((s, r) => s + safeFloat(r.book) * safeFloat(r.rate), 0);
    setNoOfCopies(copies);
    setTotalAmount(total.toFixed(2));
  }, [rows]);

  const handleOrderSearch = async (e) => {
    e && e.preventDefault();
    setEnableForm(false);
    setSearchStatus("");
    setStatus("");
    try {
      const res = await axios.post("/order", { searchOrderId });
      if (res.status === 200 && Array.isArray(res.data.result) && res.data.result.length > 0) {
        const d = res.data.result[0];
        setQueryData(d);
        setOrderId(d.orderid);
        setName(d.name || "");
        setPhone(d.phone || "");
        setGst(d.gst || "");
        setCode(d.code || "");
        setAddress(d.address || "");
        setPendingAmount(safeFloat(d.pendingamt || 0));
        // build rows from flattened fields
        const built = [];
        for (let i = 1; i <= 9; i++) {
          const part = d[`particular${i}`] || "";
          const bk = d[`book${i}`] || "";
          const rt = d[`rate${i}`] || "";
          if (part || bk || rt) built.push({ id: idRef.current++, particular: part, book: bk, rate: rt });
        }
        setRows(built.length ? built : [{ id: idRef.current++, particular: "", book: "", rate: "" }]);
        setEnableForm(true);
        setSearchStatus("success");
      } else {
        setSearchStatus("no-data");
      }
    } catch (err) {
      setSearchStatus("error");
    }
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setDisableSubmit(true);
    setStatus("");
    try {
      const payload = {
        orderId,
        name,
        phone,
        gst,
        code,
        address,
        count: rows.length,
        noOfCopies,
        totalamt: totalAmount,
        pendingamt: pendingAmount,
        paid: "",
        paymentId: "",
        paymentStatus: "",
        paymentRef: "",
      };
      // flatten rows into particular1..9 etc.
      for (let i = 0; i < 9; i++) {
        const r = rows[i];
        payload[`particular${i + 1}`] = r ? r.particular || "" : "";
        payload[`book${i + 1}`] = r ? r.book || "" : "";
        payload[`rate${i + 1}`] = r ? r.rate || "" : "";
      }

      const res = await axios.post("/update", payload);
      if (res.status === 200) {
        setQueryData({ ...res.data.result[0] });
        setStatus("success");
      } else {
        setStatus("warn");
        setDisableSubmit(false);
      }
    } catch (err) {
      setStatus("error");
      setDisableSubmit(false);
    }
  };

  const fillForm = async () => {
    const formPdfBytes = await fetch(formUrl).then((r) => r.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    const safeGet = (name) => {
      try { return form.getTextField(name); } catch { return { setText: () => {} }; }
    };

    const namePdf = safeGet("name");
    const gstPdf = safeGet("gst");
    const codePdf = safeGet("code");
    const orderIdPdf = safeGet("orderid");
    const addressPDF = safeGet("address");
    const ruPdf = safeGet("ru");
    const ordPDF = safeGet("orderDate");

    namePdf.setText((queryData.name || "").toString());
    gstPdf.setText((queryData.gst || "").toString());
    codePdf.setText((queryData.code || "").toString());
    orderIdPdf.setText((queryData.orderid || "").toString());
    addressPDF.setText((queryData.address || "").toString());

    let allAmt = 0;
    for (let i = 1; i <= 8; i++) {
      const sn = safeGet(`sn${i}`); const p = safeGet(`p${i}`); const b = safeGet(`b${i}`); const r = safeGet(`r${i}`); const a = safeGet(`a${i}`); const pa = safeGet(`pa${i}`);
      const bk = safeFloat(queryData[`book${i}`]);
      const rt = safeFloat(queryData[`rate${i}`]);
      if (bk > 0 || (queryData[`particular${i}`] || "") !== "") {
        sn.setText(i.toString());
        b.setText((queryData[`book${i}`] || "").toString());
        p.setText((queryData[`particular${i}`] || "").toString());
        r.setText((queryData[`rate${i}`] || "").toString());
        const amt = (bk * rt).toFixed(2);
        a.setText(amt.split(".")[0] || "0");
        pa.setText(amt.split(".")[1] || "00");
        allAmt += parseFloat(amt);
      }
    }

    const atPdf = safeGet("at");
    const patPdf = safeGet("pat");
    atPdf.setText(Math.floor(allAmt).toString());
    patPdf.setText(((allAmt % 1) * 100).toFixed(0).padStart(2, "0"));

    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: { name: "Rupee", plural: "Rupees", symbol: "₹", fractionalUnit: { name: "Paisa", plural: "Paise", symbol: "" } },
      },
    });

    ruPdf.setText(toWords.convert(allAmt.toFixed(2)).toString());
    ordPDF.setText((queryData.orderDate || "").toString());

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${orderId}_GSTin_Invoice.pdf`;
    link.click();
  };

  const newOrder = React.useCallback((e) => {
    e && e.preventDefault();
    window.location.reload();
  }, []);

  // UI state messages
  let statusDiv = null;
  if (status === "success" || searchStatus === "success") {
    statusDiv = <StatusBadge type="success"><div><strong className="font-medium">Order {orderId} updated successfully.</strong></div></StatusBadge>;
  } else if (status === "warn" || searchStatus === "no-data") {
    statusDiv = <StatusBadge type="warn"><div><strong className="font-medium">No data found.</strong></div></StatusBadge>;
  } else if (status === "error" || searchStatus === "error") {
    statusDiv = <StatusBadge type="error"><div><strong className="font-medium">Server error. Contact support.</strong></div></StatusBadge>;
  }

  if (!login) return <Navigate to="/form" replace />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-center mb-4 text-orange-500 leading-none tracking-tight text-xl">Order Update</h2>

      <div className="bg-white dark:bg-gray-800 border border-orange-100 rounded-lg p-5 mb-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={handleOrderSearch}>
          <div className="md:col-span-2">
            <label htmlFor="searchOrderId" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Order Number</label>
            <input
              id="searchOrderId"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="Enter order id"
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex gap-2">
            <button className="w-full inline-flex justify-center items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300">Search</button>
            <button type="button" onClick={() => { setSearchOrderId(""); setEnableForm(false); setSearchStatus(""); setStatus(""); }} className="hidden md:inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-md text-sm hover:bg-gray-50">Clear</button>
          </div>
        </form>

        {searchStatus && statusDiv}
      </div>

      {enableForm && (
        <form className="bg-white dark:bg-gray-800 border border-orange-100 rounded-lg p-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required disabled={disableSubmit} className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Mobile</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} pattern="\d{10}" required disabled={disableSubmit} className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Party GST</label>
              <input value={gst} onChange={(e) => setGst(e.target.value)} required disabled={disableSubmit} className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">State Code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} required disabled={disableSubmit} className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} required disabled={disableSubmit} className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>

          <div className="space-y-3">
            {rows.map((r) => (
              <ItemRow key={r.id} row={r} onChange={updateRow} onRemove={removeRow} disableRemove={rows.length <= 1} disableSubmit={disableSubmit} />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={addRow} disabled={disableSubmit || rows.length >= 9} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-orange-300 text-orange-600 font-medium hover:bg-orange-50 disabled:opacity-50">+ Add item</button>
              {!disableSubmit && <button type="submit" className="inline-flex items-center px-5 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700">Update</button>}
            </div>

            <div className="flex items-center gap-3">
              {disableSubmit && (
                <>
                  <button onClick={newOrder} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">New</button>
                  <button onClick={fillForm} type="button" className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Download Invoice</button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-md bg-white dark:bg-gray-800 border border-orange-100">
              <div className="text-sm text-gray-500">Copies</div>
              <div className="text-xl font-semibold">{noOfCopies}</div>
            </div>
            <div className="p-3 rounded-md bg-white dark:bg-gray-800 border border-orange-100">
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-xl font-semibold text-orange-600">₹ {totalAmount}</div>
            </div>
            <div className="p-3 rounded-md bg-white dark:bg-gray-800 border border-orange-100">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-xl font-semibold">₹ {pendingAmount}</div>
            </div>
          </div>

          {statusDiv}
        </form>
      )}
    </div>
  );
};

export default OrderUpdate;