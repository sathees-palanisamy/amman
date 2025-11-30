import * as React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { ToWords } from "to-words";
import formUrl from "./GSTin Invoice.pdf";
import { useSelector } from "react-redux";
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  BuildingLibraryIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";

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
  index
}) {
  return (
    <div
      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
      aria-label={`item-row-${row.id}`}
    >
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border border-orange-200 z-10">
        {index + 1}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-6">
          <label
            htmlFor={`particular-${row.id}`}
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
          >
            Particulars
          </label>
          <input
            id={`particular-${row.id}`}
            type="text"
            value={row.particular}
            onChange={(e) => onChange(row.id, "particular", e.target.value)}
            disabled={disableSubmit}
            placeholder="Item description"
            className="w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={`book-${row.id}`}
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
          >
            Qty
          </label>
          <input
            id={`book-${row.id}`}
            type="number"
            min="0"
            value={row.book}
            onChange={(e) => onChange(row.id, "book", e.target.value)}
            disabled={disableSubmit}
            placeholder="0"
            className="w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={`rate-${row.id}`}
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
          >
            Rate
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">₹</span>
            </div>
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
              className="w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white pl-7 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4 pb-1">
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Amount</div>
            <div className="font-bold text-gray-800 dark:text-gray-100 text-lg">
              ₹{(safeFloat(row.book) * safeFloat(row.rate)).toFixed(2)}
            </div>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); onRemove(row.id); }}
            disabled={disableRemove || disableSubmit}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
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

    // fill rows 1..8 on the existing GST template
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

    // Make the existing PDF non-editable: flatten form fields
    try {
      form.flatten();
    } catch (err) {
      // continue on flatten error
    }

    // --- Add thermal printer bill page (80mm) ---
    try {
      const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const mmToPt = (mm) => (mm / 25.4) * 72;
      const pageWidth = Math.round(mmToPt(80)); // ~227pt
      
      // Build items from queryData (server response)
      const items = [];
      for (let i = 1; i <= 9; i++) {
        const part = (queryData[`particular${i}`] || "").toString().trim();
        const bk = (queryData[`book${i}`] || "").toString().trim();
        const rt = (queryData[`rate${i}`] || "").toString().trim();
        
        if (part || bk || rt) {
          items.push({
            sn: i.toString(),
            part: part || "-",
            qty: bk || "0",
            rate: rt || "0.00",
            amount: (safeFloat(bk) * safeFloat(rt)).toFixed(2),
          });
        }
      }

      // Calculate dynamic page height based on items
      const headerHeight = 180;
      const itemHeight = 10;
      const footerHeight = 130;
      const pageHeight = headerHeight + (items.length * itemHeight) + footerHeight;
      const thermalPage = pdfDoc.addPage([pageWidth, pageHeight]);

      let y = pageHeight - 12;
      const left = 8;
      const right = pageWidth - 8;

      const drawDottedLine = (yPos) => {
        if (yPos < 0) return;
        const dashArray = [2, 2];
        thermalPage.drawLine({ start: { x: left, y: yPos }, end: { x: right, y: yPos }, thickness: 0.5, dashArray });
      };

      const drawSolidLine = (yPos) => {
        if (yPos < 0) return;
        thermalPage.drawLine({ start: { x: left, y: yPos }, end: { x: right, y: yPos }, thickness: 0.5 });
      };

      // Helper to safely draw text with Rupee symbol (use Rs. instead of ₹)
      const currencySymbol = "Rs.";

      const drawRightAligned = (text, xRight, y, options) => {
        const width = options.font.widthOfTextAtSize(text, options.size);
        thermalPage.drawText(text, { ...options, x: xRight - width, y });
      };

      const drawCenterAligned = (text, y, options) => {
        const width = options.font.widthOfTextAtSize(text, options.size);
        thermalPage.drawText(text, { ...options, x: (pageWidth - width) / 2, y });
      };

      // ===================== HEADER SECTION =====================
      drawCenterAligned("TAX INVOICE", y, { size: 10, font: helvBold });
      y -= 12;

      drawCenterAligned("Sri Amman Printers", y, { size: 14, font: helvBold });
      y -= 14;

      const companyAddressLines = [
        "99, Bhavani Road, Near Anna Statue,",
        "Perundurai - 638052, Erode District,",
        "Tamil Nadu"
      ];
      for (const addrLine of companyAddressLines) {
        drawCenterAligned(addrLine, y, { size: 8, font: helv });
        y -= 9;
      }

      drawCenterAligned("Phone: 04294-222001", y, { size: 8, font: helv });
      y -= 9;

      drawCenterAligned("GSTIN: 33ADKFS4757P1ZA", y, { size: 8, font: helv });
      y -= 9;

      drawCenterAligned("State Code: 33", y, { size: 8, font: helv });
      y -= 12;

      drawDottedLine(y + 4);
      y -= 8;

      // ===================== BILL METADATA SECTION =====================
      thermalPage.drawText(`Bill No: ${queryData.orderid || "IN-00"}`, {
        x: left,
        y: y,
        size: 9,
        font: helvBold,
      });

      const dateStr = (queryData.orderDate || "01-Jan-2025").toString();
      drawRightAligned(`Date: ${dateStr}`, right, y, { size: 9, font: helvBold });
      y -= 12;

      drawDottedLine(y + 2);
      y -= 8;

      // ===================== CUSTOMER INFO SECTION =====================
      thermalPage.drawText("TO:", { x: left, y: y, size: 9, font: helvBold });
      y -= 10;

      thermalPage.drawText((queryData.name || "Customer Name").toString(), {
        x: left + 4,
        y: y,
        size: 9,
        font: helv,
      });
      y -= 10;

      if (queryData.address) {
        thermalPage.drawText(`Address: ${(queryData.address || "").toString()}`, {
          x: left + 4,
          y: y,
          size: 8,
          font: helv,
          maxWidth: pageWidth - left * 2 - 4,
        });
        y -= 9;
      }

      if (queryData.gst) {
        thermalPage.drawText(`GSTIN: ${(queryData.gst || "").toString()}`, {
          x: left + 4,
          y: y,
          size: 8,
          font: helv,
        });
        y -= 9;
      }

      if (queryData.code) {
        thermalPage.drawText(`State Code: ${(queryData.code || "").toString()}`, {
          x: left + 4,
          y: y,
          size: 8,
          font: helv,
        });
        y -= 12;
      } else {
        y -= 3;
      }

      drawDottedLine(y + 4);
      y -= 8;

      // ===================== TABLE SECTION =====================
      // Column Positions
      const colSN = left;
      const colPart = left + 18;
      const colQty = left + 115; // Right aligned anchor
      const colRate = left + 155; // Right aligned anchor
      const colAmt = right;      // Right aligned anchor

      // Table Headers
      thermalPage.drawText("SN", { x: colSN, y: y, size: 8, font: helvBold });
      thermalPage.drawText("Particulars", { x: colPart, y: y, size: 8, font: helvBold });
      drawRightAligned("Qty", colQty, y, { size: 8, font: helvBold });
      drawRightAligned("Rate", colRate, y, { size: 8, font: helvBold });
      drawRightAligned("Amount", colAmt, y, { size: 8, font: helvBold });
      y -= 10;

      drawSolidLine(y + 3);
      y -= 8;

      // Items
      for (const it of items) {
        if (y < 20) break;
        
        thermalPage.drawText(it.sn, { x: colSN, y: y, size: 8, font: helv });

        const maxPartChars = 22;
        let partText = it.part;
        if (partText.length > maxPartChars) {
          partText = partText.slice(0, maxPartChars);
        }
        thermalPage.drawText(partText, { x: colPart, y: y, size: 8, font: helv });

        drawRightAligned(it.qty, colQty, y, { size: 8, font: helv });
        drawRightAligned(it.rate, colRate, y, { size: 8, font: helv });
        drawRightAligned(it.amount, colAmt, y, { size: 8, font: helv });
        y -= 10;
      }

      drawSolidLine(y + 3);
      y -= 8;

      // ===================== TOTALS SECTION =====================
      const rightColLabel = right - 80;
      const rightColValue = right;

      if (y > 5) {
        drawRightAligned("Subtotal:", rightColLabel, y, { size: 8, font: helv });
        drawRightAligned(`${currencySymbol} ${allAmt.toFixed(2)}`, rightColValue, y, { size: 8, font: helvBold });
        y -= 10;
      }

      drawDottedLine(y + 2);
      y -= 8;

      const cgst0 = 0;
      const cgst3 = (allAmt * 0.03);
      const cgst5 = (allAmt * 0.05);
      const cgst12 = (allAmt * 0.12);

      const drawTaxLine = (label, value) => {
         if (value > 0) {
            drawRightAligned(label, rightColLabel, y, { size: 8, font: helv });
            drawRightAligned(`${currencySymbol} ${value.toFixed(2)}`, rightColValue, y, { size: 8, font: helv });
            y -= 9;
         }
      };

      if (y > 5) {
         drawTaxLine("IGST @ 0%:", cgst0);
         drawTaxLine("IGST @ 3%:", cgst3);
         drawTaxLine("IGST @ 5%:", cgst5);
         drawTaxLine("IGST @ 12%:", cgst12);
      }

      drawSolidLine(y + 2);
      y -= 8;

      if (y > 5) {
        const grand = allAmt + cgst0 + cgst3 + cgst5 + cgst12;
        
        drawRightAligned("TOTAL:", rightColLabel, y, { size: 10, font: helvBold });
        drawRightAligned(`${currencySymbol} ${grand.toFixed(2)}`, rightColValue, y, { size: 10, font: helvBold });
        y -= 14;

        drawSolidLine(y + 4);
        y -= 10;

        const words = toWords.convert(grand.toFixed(2));
        thermalPage.drawText("Amount (in words):", { x: left, y: y, size: 7, font: helvBold });
        y -= 8;
        const wordsLine = (words || "").toString();
        thermalPage.drawText(wordsLine, {
          x: left + 4,
          y: y,
          size: 7,
          font: helv,
          maxWidth: pageWidth - left * 2 - 4,
          lineHeight: 9,
        });
        // Adjust y if words wrap (approximate)
        if (wordsLine.length > 50) y -= 9;
        y -= 12;

        drawDottedLine(y + 4);
        y -= 12;

        // Footer Signatory
        drawRightAligned("For Sri Amman Printers", right, y, { size: 8, font: helvBold });
        y -= 25;
        drawRightAligned("Authorized Signatory", right, y, { size: 8, font: helv });
        y -= 12;

        drawCenterAligned("Thank You", y, { size: 9, font: helvBold });
      }

    } catch (err) {
      console.error("Thermal page creation failed", err);
    }

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
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 shadow-sm animate-fade-in">
        <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
        <div>
          <strong className="font-bold block">Order Created Successfully!</strong>
          <span className="text-sm opacity-90">Order ID #{orderId}. You can now download the invoice or start a new order.</span>
        </div>
      </div>
    );
  } else if (status === "warn") {
    statusDiv = (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 shadow-sm animate-fade-in">
        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
        <div>
          <strong className="font-bold block">Attention Needed</strong>
          <span className="text-sm opacity-90">There was an issue creating the order. Please check the details and try again.</span>
        </div>
      </div>
    );
  } else if (status === "error") {
    statusDiv = (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 shadow-sm animate-fade-in">
        <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <strong className="font-bold block">System Error</strong>
          <span className="text-sm opacity-90">Something went wrong on our end. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!login) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">New Order</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new invoice for your customer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</div>
              <div className="text-2xl font-extrabold text-orange-600 flex items-center gap-1">
                <CurrencyRupeeIcon className="w-5 h-5" />
                {liveTotals.total}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Customer Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Customer Details</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={disableSubmit}
                    placeholder="Enter customer name"
                    className="block w-full pl-10 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 transition-shadow dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="\d{10}"
                    disabled={disableSubmit}
                    placeholder="10-digit mobile number"
                    className="block w-full pl-10 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 transition-shadow dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GST Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    required
                    disabled={disableSubmit}
                    placeholder="GSTIN"
                    className="block w-full pl-10 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 transition-shadow dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    disabled={disableSubmit}
                    placeholder="e.g. 33"
                    className="block w-full pl-10 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 transition-shadow dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Billing Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    disabled={disableSubmit}
                    placeholder="Enter full billing address"
                    className="block w-full pl-10 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 transition-shadow dark:bg-gray-700 dark:border-gray-600 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Order Items</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{rows.length} items</span>
            </div>
            
            <div className="space-y-3">
              {rows.map((r, i) => (
                <ItemRow
                  key={r.id}
                  row={r}
                  index={i}
                  onChange={updateRow}
                  onRemove={removeRow}
                  disableRemove={rows.length <= 1}
                  disableSubmit={disableSubmit}
                />
              ))}
            </div>

            <button
              onClick={addRow}
              disabled={disableSubmit || rows.length >= 9}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
              Add Another Item
            </button>
          </div>

          {/* Actions & Status */}
          <div className="space-y-6">
            {statusDiv}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!disableSubmit ? (
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Submit Order
                </button>
              ) : (
                <>
                  <button
                    onClick={newOrder}
                    className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                    Start New Order
                  </button>
                  
                  <button
                    onClick={fillForm}
                    className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    Download Invoice
                  </button>
                </>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default OrderForm;