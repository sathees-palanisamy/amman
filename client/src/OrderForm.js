import * as React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { ToWords } from "to-words";
import formUrl from "./GSTin Invoice.pdf";
import { useSelector } from "react-redux";

const safeFloat = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

// stable, memoized row component — uses row.id as key so inputs are not remounted
const ItemRow = React.memo(function ItemRow({
  row,
  onChange,
  onRemove,
  disableRemove,
  disableSubmit,
}) {
  return (
    <div
      className="relative bg-white dark:bg-gray-800 border border-orange-100 rounded-lg p-4 shadow-sm grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
      aria-label={`item-row-${row.id}`}
    >
      <div className="md:col-span-3">
        <label
          htmlFor={`particular-${row.id}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Particular
        </label>
        <input
          id={`particular-${row.id}`}
          type="text"
          value={row.particular}
          onChange={(e) => onChange(row.id, "particular", e.target.value)}
          disabled={disableSubmit}
          placeholder="Enter particular"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="md:col-span-1">
        <label
          htmlFor={`book-${row.id}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Copies
        </label>
        <input
          id={`book-${row.id}`}
          type="number"
          min="0"
          value={row.book}
          onChange={(e) => onChange(row.id, "book", e.target.value)}
          disabled={disableSubmit}
          placeholder="0"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="md:col-span-1">
        <label
          htmlFor={`rate-${row.id}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Rate
        </label>
        <input
          id={`rate-${row.id}`}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={row.rate}
          onChange={(e) => onChange(row.id, "rate", e.target.value)}
          disabled={disableSubmit}
          placeholder="0.00"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="md:col-span-1 flex flex-col items-end md:items-center gap-2">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Amount
          <div className="font-medium text-gray-800 dark:text-gray-100">
            {(safeFloat(row.book) * safeFloat(row.rate)).toFixed(2)}
          </div>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); onRemove(row.id); }}
          disabled={disableRemove || disableSubmit}
          className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
          title="Remove entry"
          aria-disabled={disableRemove || disableSubmit}
        >
          <span className="hidden md:inline">Remove</span>
          <span className="md:hidden text-red-600">Remove</span>
        </button>
      </div>
    </div>
  );
});

const OrderForm = () => {
  const login = useSelector((state) => state.auth.login);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gst, setGst] = React.useState("");
  const [code, setCode] = React.useState("");
  const [address, setAddress] = React.useState("");

  // rows: array of objects with stable id
  const idRef = React.useRef(1);
  const [rows, setRows] = React.useState(() => [{ id: idRef.current++, particular: "", book: "", rate: "" }]);

  const [disableSubmit, setDisableSubmit] = React.useState(false);
  const [pendingAmount, setPendingAmount] = React.useState(0);
  const [noOfCopies, setNoOfCopies] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [orderId, setOrderId] = React.useState("");
  const [queryData, setQueryData] = React.useState({});

  // handlers
  const addRow = React.useCallback((e) => {
    e && e.preventDefault();
    if (rows.length >= 9) return;
    setRows((prev) => [...prev, { id: idRef.current++, particular: "", book: "", rate: "" }]);
  }, [rows.length]);

  const removeRow = React.useCallback((id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRow = React.useCallback((id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  // compute totals live
  const liveTotals = React.useMemo(() => {
    let copies = 0;
    let total = 0;
    for (const r of rows) {
      const b = safeFloat(r.book);
      const rt = safeFloat(r.rate);
      copies += b;
      total += b * rt;
    }
    return { copies, total: total.toFixed(2) };
  }, [rows]);

  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      let tempNoOfCopies = 0;
      let tempTotalAmount = 0;

      for (const r of rows) {
        const b = safeFloat(r.book);
        const rt = safeFloat(r.rate);
        tempNoOfCopies += b;
        tempTotalAmount += b * rt;
      }

      setNoOfCopies(tempNoOfCopies);
      setTotalAmount(tempTotalAmount.toFixed(2));
      setDisableSubmit(true);

      try {
        const payload = {
          name,
          phone,
          gst,
          code,
          address,
          count: rows.length,
          noOfCopies: tempNoOfCopies,
          totalamt: tempTotalAmount.toFixed(2),
          pendingamt: tempTotalAmount.toFixed(2),
          paid: "",
          paymentId: "",
          paymentStatus: "",
          paymentRef: "",
        };

        // flatten rows into particular1..9, book1..9, rate1..9
        for (let i = 0; i < 9; i++) {
          const r = rows[i];
          payload[`particular${i + 1}`] = r ? r.particular || "" : "";
          payload[`book${i + 1}`] = r ? (r.book || "") : "";
          payload[`rate${i + 1}`] = r ? (r.rate || "") : "";
        }

        const response = await axios.post("/create", payload);

        if (response.status === 200) {
          setOrderId(response.data.result[0].orderid);
          setQueryData({ ...response.data.result[0] });
          setStatus("success");
        } else {
          setStatus("warn");
          setDisableSubmit(false);
        }
      } catch (err) {
        setStatus("error");
        setDisableSubmit(false);
      }
    },
    [name, phone, gst, code, address, rows]
  );

  const fillForm = React.useCallback(async () => {
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    const safeGet = (name) => {
      try {
        return form.getTextField(name);
      } catch {
        return { setText: () => {} };
      }
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
      const sn = safeGet(`sn${i}`);
      const p = safeGet(`p${i}`);
      const b = safeGet(`b${i}`);
      const r = safeGet(`r${i}`);
      const a = safeGet(`a${i}`);
      const pa = safeGet(`pa${i}`);

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
        currencyOptions: {
          name: "Rupee",
          plural: "Rupees",
          symbol: "₹",
          fractionalUnit: { name: "Paisa", plural: "Paise", symbol: "" },
        },
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
  }, [queryData, orderId]);

  const newOrder = React.useCallback((e) => {
    e && e.preventDefault();
    window.location.reload();
  }, []);

  // status UI
  let statusDiv = null;
  if (status === "success") {
    statusDiv = (
      <div className="p-4 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
        <strong className="font-semibold">Success:</strong> Order created #{orderId}. Click New Order or Download invoice.
      </div>
    );
  } else if (status === "warn") {
    statusDiv = (
      <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
        <strong className="font-semibold">Warning:</strong> Issue creating order, contact support.
      </div>
    );
  } else if (status === "error") {
    statusDiv = (
      <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
        <strong className="font-semibold">Error:</strong> Server error, try again later.
      </div>
    );
  }

  if (!login) return <Navigate to="/" replace />;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-extrabold text-orange-600">Order Form</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-300 text-right">
            <div>
              Total: <span className="font-semibold text-orange-600">₹ {liveTotals.total}</span>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 bg-orange-50/20 p-6 rounded-lg border border-orange-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={disableSubmit}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mobile</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="\d{10}"
              disabled={disableSubmit}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Party GST</label>
            <input
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              required
              disabled={disableSubmit}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">State Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={disableSubmit}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={disableSubmit}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((r) => (
            <ItemRow
              key={r.id}
              row={r}
              onChange={updateRow}
              onRemove={removeRow}
              disableRemove={rows.length <= 1}
              disableSubmit={disableSubmit}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={addRow}
              disabled={disableSubmit || rows.length >= 9}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-orange-300 text-orange-600 font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
            >
              + Add item
            </button>

            {!disableSubmit && (
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                Submit Order
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {disableSubmit && (
              <>
                <button onClick={newOrder} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300">
                  New Order
                </button>

                <button onClick={fillForm} className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300">
                  Download Invoice
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-md bg-white dark:bg-gray-800 border border-orange-100">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-xl font-semibold text-orange-600">₹ {disableSubmit ? totalAmount : liveTotals.total}</div>
          </div>
        </div>

        <div>{statusDiv}</div>
      </form>
    </div>
  );
};

export default OrderForm;