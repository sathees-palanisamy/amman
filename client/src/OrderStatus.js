import * as React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PDFDocument, StandardFonts } from "pdf-lib";
import ToWords from "to-words";
import formUrl from "./GSTin Invoice.pdf";

axios.defaults.baseURL = "http://localhost:5001";

const safeFloat = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

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
  const [downloadingOrderId, setDownloadingOrderId] = React.useState(null);

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

  const generatePDF = React.useCallback(async (orderData) => {
    try {
      setDownloadingOrderId(orderData.orderid);

      // Fetch the form PDF template with proper error handling
      let formPdfBytes;
      
      try {
        const response = await fetch(formUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Validate that it's actually a PDF
        if (!blob.type.includes('pdf') && !blob.type.includes('octet-stream')) {
          console.warn(`Unexpected MIME type: ${blob.type}`);
        }
        
        formPdfBytes = await blob.arrayBuffer();
        
        // Check if the buffer looks like a PDF (starts with %PDF)
        const view = new Uint8Array(formPdfBytes);
        const header = String.fromCharCode(view[0], view[1], view[2], view[3]);
        if (header !== '%PDF') {
          throw new Error('Template file is not a valid PDF');
        }
        
      } catch (fetchErr) {
        console.error("Template fetch error:", fetchErr);
        alert("Error: Could not load PDF template. Please ensure the template PDF exists.");
        setDownloadingOrderId(null);
        return;
      }

      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();

      const safeGet = (name) => {
        try {
          return form.getTextField(name);
        } catch {
          return { setText: () => {} };
        }
      };

      // Fill form fields
      const namePdf = safeGet("name");
      const gstPdf = safeGet("gst");
      const codePdf = safeGet("code");
      const orderIdPdf = safeGet("orderid");
      const addressPDF = safeGet("address");
      const ruPdf = safeGet("ru");
      const ordPDF = safeGet("orderDate");

      namePdf.setText((orderData.name || "").toString());
      gstPdf.setText((orderData.gst || "").toString());
      codePdf.setText((orderData.code || "").toString());
      orderIdPdf.setText((orderData.orderid || "").toString());
      addressPDF.setText((orderData.address || "").toString());

      // Fill rows 1..8
      let allAmt = 0;
      for (let i = 1; i <= 8; i++) {
        const sn = safeGet(`sn${i}`);
        const p = safeGet(`p${i}`);
        const b = safeGet(`b${i}`);
        const r = safeGet(`r${i}`);
        const a = safeGet(`a${i}`);
        const pa = safeGet(`pa${i}`);

        const bk = safeFloat(orderData[`book${i}`]);
        const rt = safeFloat(orderData[`rate${i}`]);
        if (bk > 0 || (orderData[`particular${i}`] || "") !== "") {
          sn.setText(i.toString());
          b.setText((orderData[`book${i}`] || "").toString());
          p.setText((orderData[`particular${i}`] || "").toString());
          r.setText((orderData[`rate${i}`] || "").toString());
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

      // Initialize ToWords correctly
      let amountInWords = "";
      try {
        const toWordsInstance = new ToWords({
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
        amountInWords = toWordsInstance.convert(allAmt.toFixed(2)) || "";
      } catch (err) {
        console.warn("ToWords conversion error:", err);
        amountInWords = `Rs. ${allAmt.toFixed(2)}`;
      }

      ruPdf.setText(amountInWords.toString());
      ordPDF.setText((orderData.orderDate || "").toString());

      // Flatten form
      try {
        form.flatten();
      } catch (err) {
        console.warn("Form flatten warning:", err);
      }

      // --- Add thermal printer bill page (80mm) ---
      const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const mmToPt = (mm) => (mm / 25.4) * 72;
      const pageWidth = Math.round(mmToPt(80));

      // Build items
      const items = [];
      for (let i = 1; i <= 9; i++) {
        const part = (orderData[`particular${i}`] || "").toString().trim();
        const bk = (orderData[`book${i}`] || "").toString().trim();
        const rt = (orderData[`rate${i}`] || "").toString().trim();

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

      const headerHeight = 120;
      const itemHeight = 10;
      const footerHeight = 80;
      const pageHeight = headerHeight + items.length * itemHeight + footerHeight;
      const thermalPage = pdfDoc.addPage([pageWidth, pageHeight]);

      let y = pageHeight - 8;
      const left = 5;
      const right = pageWidth - 5;

      const drawDottedLine = (yPos, char = "-") => {
        if (yPos < 0) return;
        const lineText = char.repeat(35);
        thermalPage.drawText(lineText, {
          x: left,
          y: yPos,
          size: 5.5,
          font: helv,
        });
      };

      const drawSolidLine = (yPos) => {
        if (yPos < 0) return;
        thermalPage.drawLine({ start: { x: left, y: yPos }, end: { x: right, y: yPos }, thickness: 0.5 });
      };

      const currencySymbol = "Rs.";

      const drawRightAligned = (text, xRight, yPos, options) => {
        const width = options.font.widthOfTextAtSize(text, options.size);
        thermalPage.drawText(text, { ...options, x: xRight - width, y: yPos });
      };

      const drawCenterAligned = (text, yPos, options) => {
        const width = options.font.widthOfTextAtSize(text, options.size);
        thermalPage.drawText(text, { ...options, x: (pageWidth - width) / 2, y: yPos });
      };

      // ========== HEADER SECTION ==========
      drawCenterAligned("Sri Amman Printers", y, { size: 10, font: helvBold });
      y -= 11;

      const companyAddressLines = [
        "99, Bhavani Road, Near Anna Statue,",
        "Perundurai - 638052, Erode District,",
        "Tamil Nadu"
      ];
      for (const addrLine of companyAddressLines) {
        drawCenterAligned(addrLine, y, { size: 6, font: helv });
        y -= 6;
      }

      drawCenterAligned("Phone: 04294-222001", y, { size: 6, font: helv });
      y -= 6;

      drawCenterAligned("GSTIN No: 33ADKFS4757P1ZA", y, { size: 6, font: helv });
      y -= 6;

      drawCenterAligned("STATE CODE: 33", y, { size: 6, font: helv });
      y -= 8;

      drawDottedLine(y);
      y -= 7;

      // ========== BILL METADATA ==========
      thermalPage.drawText(`Bill No: ${orderData.orderid || "IN-00"}`, {
        x: left,
        y: y,
        size: 7,
        font: helvBold,
      });

      const dateStr = (orderData.orderDate || "01-Jan-2025").toString();
      drawRightAligned(`Date: ${dateStr}`, right, y, { size: 7, font: helvBold });
      y -= 9;

      drawDottedLine(y);
      y -= 7;

      // ========== CUSTOMER INFO ==========
      thermalPage.drawText("TO:", { x: left, y: y, size: 7, font: helvBold });
      y -= 8;

      thermalPage.drawText((orderData.name || "Customer Name").toString(), {
        x: left + 2,
        y: y,
        size: 7,
        font: helvBold,
      });
      y -= 7;

      if (orderData.address) {
        thermalPage.drawText(`Address: ${orderData.address}`, {
          x: left + 2,
          y: y,
          size: 6,
          font: helv,
          maxWidth: pageWidth - left * 2 - 2,
        });
        y -= 7;
      }

      if (orderData.gst) {
        thermalPage.drawText(`GSTIN: ${orderData.gst}`, {
          x: left + 2,
          y: y,
          size: 6,
          font: helv,
        });
        y -= 7;
      }

      if (orderData.code) {
        thermalPage.drawText(`State Code: ${orderData.code}`, {
          x: left + 2,
          y: y,
          size: 6,
          font: helv,
        });
        y -= 8;
      } else {
        y -= 2;
      }

      drawDottedLine(y);
      y -= 6;

      // ========== TABLE HEADERS ==========
      const colSN = left;
      const colPart = left + 12;
      const colQty = left + 95;
      const colRate = left + 115;
      const colAmt = right;

      thermalPage.drawText("SN", { x: colSN, y: y, size: 6, font: helvBold });
      thermalPage.drawText("Particulars", { x: colPart, y: y, size: 6, font: helvBold });
      drawRightAligned("Qty", colQty, y, { size: 6, font: helvBold });
      drawRightAligned("Rate", colRate, y, { size: 6, font: helvBold });
      drawRightAligned("Amt", colAmt, y, { size: 6, font: helvBold });
      y -= 7;

      drawSolidLine(y + 1);
      y -= 5;

      // ========== ITEMS LOOP ==========
      for (const it of items) {
        if (y < 50) break; // Reserve 50 points for totals section

        thermalPage.drawText(it.sn, { x: colSN, y: y, size: 6, font: helv });

        const maxPartChars = 16;
        let partText = it.part;
        if (partText.length > maxPartChars) {
          partText = partText.slice(0, maxPartChars) + "..";
        }
        thermalPage.drawText(partText, { x: colPart, y: y, size: 6, font: helv });

        drawRightAligned(it.qty, colQty, y, { size: 6, font: helv });
        drawRightAligned(it.rate, colRate, y, { size: 6, font: helv });
        drawRightAligned(`${it.amount}`, colAmt, y, { size: 6, font: helv });
        y -= 8;
      }

      drawSolidLine(y + 1);
      y -= 6;

      // ========== TOTALS SECTION ==========
      const rightColLabel = right - 75;
      const rightColValue = right;

      // Subtotal
      drawRightAligned("Subtotal:", rightColLabel, y, { size: 6.5, font: helv });
      drawRightAligned(`${currencySymbol} ${allAmt.toFixed(2)}`, rightColValue, y, { size: 6.5, font: helvBold });
      y -= 7;

      drawDottedLine(y);
      y -= 6;

      // Tax calculations
      const cgst0 = 0;
      const cgst3 = allAmt * 0.03;
      const cgst5 = allAmt * 0.05;
      const cgst12 = allAmt * 0.12;

      // Tax lines (only print if > 0)
      if (cgst0 > 0 && y > 30) {
        drawRightAligned("IGST @ 0%:", rightColLabel, y, { size: 6, font: helv });
        drawRightAligned(`${currencySymbol} ${cgst0.toFixed(2)}`, rightColValue, y, { size: 6, font: helv });
        y -= 6;
      }

      if (cgst3 > 0 && y > 30) {
        drawRightAligned("IGST @ 3%:", rightColLabel, y, { size: 6, font: helv });
        drawRightAligned(`${currencySymbol} ${cgst3.toFixed(2)}`, rightColValue, y, { size: 6, font: helv });
        y -= 6;
      }

      if (cgst5 > 0 && y > 30) {
        drawRightAligned("IGST @ 5%:", rightColLabel, y, { size: 6, font: helv });
        drawRightAligned(`${currencySymbol} ${cgst5.toFixed(2)}`, rightColValue, y, { size: 6, font: helv });
        y -= 6;
      }

      if (cgst12 > 0 && y > 30) {
        drawRightAligned("IGST @ 12%:", rightColLabel, y, { size: 6, font: helv });
        drawRightAligned(`${currencySymbol} ${cgst12.toFixed(2)}`, rightColValue, y, { size: 6, font: helv });
        y -= 6;
      }

      // Total line
      if (y > 22) {
        drawSolidLine(y + 1);
        y -= 6;

        const grand = allAmt + cgst0 + cgst3 + cgst5 + cgst12;
        drawRightAligned("TOTAL:", rightColLabel, y, { size: 8, font: helvBold });
        drawRightAligned(`${currencySymbol} ${grand.toFixed(2)}`, rightColValue, y, { size: 8, font: helvBold });
        y -= 10;

        drawSolidLine(y + 2);
        y -= 8;

        // Amount in words
        if (y > 10) {
          thermalPage.drawText("Amount in words:", { x: left, y: y, size: 6, font: helv });
          y -= 6;

          const wordsText = amountInWords || `Rs. ${grand.toFixed(2)}`;
          thermalPage.drawText(wordsText, {
            x: left + 2,
            y: y,
            size: 5.5,
            font: helv,
            maxWidth: pageWidth - left * 2 - 2,
          });
          y -= 8;
        }

        if (y > 5) {
          drawDottedLine(y);
          y -= 7;

          drawCenterAligned("Thank You!", y, { size: 7, font: helvBold });
        }
      }

      // Save and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${orderData.orderid}_Invoice.pdf`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(`Error generating PDF: ${err.message}`);
    } finally {
      setDownloadingOrderId(null);
    }
  }, []);

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
                        <button
                          onClick={() => generatePDF(row)}
                          disabled={downloadingOrderId === row.orderid}
                          className={`px-3 py-1 text-xs rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all ${
                            downloadingOrderId === row.orderid
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-orange-600 hover:bg-orange-700"
                          }`}
                        >
                          {downloadingOrderId === row.orderid ? "Generating..." : "Download"}
                        </button>
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