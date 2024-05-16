import * as React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { PDFDocument } from 'pdf-lib';
import { ToWords } from 'to-words';
import formUrl from './GSTin Invoice.pdf';
import { useSelector } from 'react-redux';

// axios.defaults.baseURL = "http://localhost:5001";

const OrderUpdate = () => {
  const [searchStatus,setSearchStatus] =  React.useState("");
  const [name, setName] = React.useState(""); 
  const [phone, setPhone] = React.useState("");
  const [gst, setGst] = React.useState("");
  const [code, setCode] = React.useState("");
  const [address, setAddress] = React.useState("");
  const login = useSelector(state => state.auth.login);

  const [particular, setParticular] = React.useState([]);
  const [book, setBook] = React.useState([]);
  const [rate, setRate] = React.useState([]);
  const [disableSubmit, setDisableSubmit] = React.useState(false);

  const [count, setCount] = React.useState(1);

  const [noOfCopies, setNoOfCopies] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [pendingAmount, setPendingAmount] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [orderId, setOrderId] = React.useState("");
  const [searchOrderId, setSearchOrderId] = React.useState("");
  const [enableForm, setEnableForm] = React.useState(false);
  const [queryData,setQueryData] = React.useState({});

  const updateParticularAtIndex = (index, newElement) => {
    const newArray = [...particular];
    newArray[index] = newElement;
    setParticular(newArray);
  };

  const updateBookAtIndex = (index, newElement) => {
    const newArray = [...book];
    newArray[index] = newElement;
    setBook(newArray);
  };

  const updateRateAtIndex = (index, newElement) => {
    const newArray = [...rate];
    newArray[index] = newElement;
    setRate(newArray);
  };

  const incrementCount = (e) => {
    e.preventDefault();
    setCount((prevCounter) => prevCounter + 1);
  };

  const fillForm = async () => {
    // Step 1: Load the PDF form.
    const formPdfBytes = await fetch(formUrl).then((res) =>
        res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // Step 2: Retrieve the form fields.
    const form = pdfDoc.getForm();
    const namePdf = form.getTextField('name');
const gstPdf = form.getTextField('gst');
const codePdf = form.getTextField('code');
const orderIdPdf = form.getTextField('orderid');
const addressPDF = form.getTextField('address');
const sn1Pdf = form.getTextField('sn1');
const sn2Pdf = form.getTextField('sn2');
const sn3Pdf = form.getTextField('sn3');
const sn4Pdf = form.getTextField('sn4');
const sn5Pdf = form.getTextField('sn5');
const sn6Pdf = form.getTextField('sn6');
const sn7Pdf = form.getTextField('sn7');
const sn8Pdf = form.getTextField('sn8');

const p1Pdf = form.getTextField('p1');
const p2Pdf = form.getTextField('p2');
const p3Pdf = form.getTextField('p3');
const p4Pdf = form.getTextField('p4');
const p5Pdf = form.getTextField('p5');
const p6Pdf = form.getTextField('p6');
const p7Pdf = form.getTextField('p7');
const p8Pdf = form.getTextField('p8');

const b1Pdf = form.getTextField('b1');
const b2Pdf = form.getTextField('b2');
const b3Pdf = form.getTextField('b3');
const b4Pdf = form.getTextField('b4');
const b5Pdf = form.getTextField('b5');
const b6Pdf = form.getTextField('b6');
const b7Pdf = form.getTextField('b7');
const b8Pdf = form.getTextField('b8');
// const btPdf = form.getTextField('bt');

const r1Pdf = form.getTextField('r1');
const r2Pdf = form.getTextField('r2');
const r3Pdf = form.getTextField('r3');
const r4Pdf = form.getTextField('r4');
const r5Pdf = form.getTextField('r5');
const r6Pdf = form.getTextField('r6');
const r7Pdf = form.getTextField('r7');
const r8Pdf = form.getTextField('r8');

const a1Pdf = form.getTextField('a1');
const a2Pdf = form.getTextField('a2');
const a3Pdf = form.getTextField('a3');
const a4Pdf = form.getTextField('a4');
const a5Pdf = form.getTextField('a5');
const a6Pdf = form.getTextField('a6');
const a7Pdf = form.getTextField('a7');
const a8Pdf = form.getTextField('a8');
const atPdf = form.getTextField('at');

const pa1Pdf = form.getTextField('pa1');
const pa2Pdf = form.getTextField('pa2');
const pa3Pdf = form.getTextField('pa3');
const pa4Pdf = form.getTextField('pa4');
const pa5Pdf = form.getTextField('pa5');
const pa6Pdf = form.getTextField('pa6');
const pa7Pdf = form.getTextField('pa7');
const pa8Pdf = form.getTextField('pa8');
const patPdf = form.getTextField('pat');

const ruPdf = form.getTextField('ru');

const ordPDF = form.getTextField('orderDate');



    // Step 3: Set values for the form fields.
    namePdf.setText(queryData.name.toString());
gstPdf.setText(queryData.gst.toString());
codePdf.setText(queryData.code.toString());
orderIdPdf.setText(queryData.orderid.toString());
addressPDF.setText(queryData.address.toString());

let amt1 = 0
if (queryData.book1 !== "undefined") {
  sn1Pdf.setText('1');
  b1Pdf.setText(queryData.book1.toString());
  p1Pdf.setText(queryData.particular1.toString());
  r1Pdf.setText(queryData.rate1.toString());
  let amt = parseFloat(queryData.book1) * parseFloat(queryData.rate1);
  amt1 = amt.toFixed(2);
  a1Pdf.setText((amt1.toString().split(".")[0]).toString());
  pa1Pdf.setText(amt1.toString().split(".")[1]);
}

let amt2 = 0
if (queryData.book2 !== "undefined") {
  sn2Pdf.setText('2');
  b2Pdf.setText(queryData.book2.toString());
  p2Pdf.setText(queryData.particular2.toString());
  r2Pdf.setText(queryData.rate2.toString());
  let amt = parseFloat(queryData.book2) * parseFloat(queryData.rate2);
  amt2 = amt.toFixed(2);
  a2Pdf.setText((amt2.toString().split(".")[0]).toString());
  pa2Pdf.setText((amt2.toString().split(".")[1]).toString());
}

let amt3 = 0
if (queryData.book3 !== "undefined") {
  sn3Pdf.setText('3');
  b3Pdf.setText(queryData.book3.toString());
  p3Pdf.setText(queryData.particular3.toString());
  r3Pdf.setText(queryData.rate3.toString());
  let amt = parseFloat(queryData.book3) * parseFloat(queryData.rate3);
  amt3 = amt.toFixed(2);
  a3Pdf.setText((amt3.toString().split(".")[0]).toString());
  pa3Pdf.setText((amt3.toString().split(".")[1]).toString());
}

let amt4 = 0
if (queryData.book4 !== "undefined") {
  sn4Pdf.setText('4');
  b4Pdf.setText(queryData.book4.toString());
  p4Pdf.setText(queryData.particular4.toString());
  r4Pdf.setText(queryData.rate4.toString());
  let amt = parseFloat(queryData.book4) * parseFloat(queryData.rate4);
  amt4 = amt.toFixed(2);
  a4Pdf.setText((amt4.toString().split(".")[0]).toString());
  pa4Pdf.setText((amt4.toString().split(".")[1]).toString());
}

let amt5 = 0
if (queryData.book5 !== "undefined") {
  sn5Pdf.setText('5');
  b5Pdf.setText(queryData.book5.toString());
  p5Pdf.setText(queryData.particular5.toString());
  r5Pdf.setText(queryData.rate5.toString());
  let amt = parseFloat(queryData.book5) * parseFloat(queryData.rate5);
  amt5 = amt.toFixed(2);
  a5Pdf.setText((amt5.toString().split(".")[0]).toString());
  pa5Pdf.setText((amt5.toString().split(".")[1]).toString());
}

let amt6 = 0
if (queryData.book6 !== "undefined") {
  sn6Pdf.setText('6');
  b6Pdf.setText(queryData.book6.toString());
  p6Pdf.setText(queryData.particular6.toString());
  r6Pdf.setText(queryData.rate6.toString());
  let amt = parseFloat(queryData.book6) * parseFloat(queryData.rate6);
  amt6 = amt.toFixed(2);
  a6Pdf.setText((amt6.toString().split(".")[0]).toString());
  pa6Pdf.setText((amt6.toString().split(".")[1]).toString());
}

let amt7 = 0
if (queryData.book7 !== "undefined") {
  sn7Pdf.setText('7');
  b7Pdf.setText(queryData.book7.toString());
  p7Pdf.setText(queryData.particular7.toString());
  r7Pdf.setText(queryData.rate7.toString());
  let amt = parseFloat(queryData.book7) * parseFloat(queryData.rate7);
  amt7 = amt.toFixed(2);
  a7Pdf.setText((amt7.toString().split(".")[0]).toString());
  pa7Pdf.setText((amt7.toString().split(".")[1]).toString());
}

let amt8 = 0
if (queryData.book8 !== "undefined") {
  sn8Pdf.setText('8');
  b8Pdf.setText(queryData.book8.toString());
  p8Pdf.setText(queryData.particular8.toString());
  r8Pdf.setText(queryData.rate8.toString());
  let amt = parseFloat(queryData.book8) * parseFloat(queryData.rate8);
  amt8 = amt.toFixed(2);
  a8Pdf.setText((amt8.toString().split(".")[0]).toString());
  pa8Pdf.setText((amt8.toString().split(".")[1]).toString());
}

let allAmt = parseFloat(amt1) + parseFloat(amt2) + parseFloat(amt3) + parseFloat(amt4) + parseFloat(amt5) + parseFloat(amt6) + parseFloat(amt7) + parseFloat(amt8);

let allAmt1 = parseFloat(allAmt).toFixed(2);

atPdf.setText(allAmt1.toString().split(".")[0]);
patPdf.setText(allAmt1.toString().split(".")[1]);

ordPDF.setText(queryData.orderDate.toString())

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
});


let words = toWords.convert(allAmt1);

ruPdf.setText(words.toString());

    // Step 4: Save the modified PDF.
    const pdfBytes = await pdfDoc.save();

    // Step 5: Create a `Blob` from the PDF bytes,
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Step 6: Create a download URL for the `Blob`.
    const url = URL.createObjectURL(blob);

    // Step 7: Create a link element and simulate a click event to trigger the download.
    const link = document.createElement('a');
    link.href = url;
    link.download = `${orderId}_GSTin_Invoice.pdf`;
    link.click();
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempNoOfCopies = 0;
    let tempTotalAmount = 0;

    for (let i = 0; i < count; i++) {
      tempNoOfCopies = tempNoOfCopies + parseFloat(book[i]);
      tempTotalAmount =
        tempTotalAmount + parseFloat(book[i]) * parseFloat(rate[i]);
    }

    setNoOfCopies(tempNoOfCopies);
    setTotalAmount(tempTotalAmount.toFixed(2));
    let pendAmt = parseFloat(pendingAmount);
    setPendingAmount(pendAmt.toFixed(2))
    setDisableSubmit(true);

    await axios({
      method: "post",
      url: "/update",
      data: {
        orderId,
        name,
        phone,
        gst,
        code,
        address,
        particular1: particular[0],
        book1: book[0],
        rate1: rate[0],
        particular2: particular[1],
        book2: book[1],
        rate2: rate[1],
        particular3: particular[2],
        book3: book[2],
        rate3: rate[2],
        particular4: particular[3],
        book4: book[3],
        rate4: rate[3],
        particular5: particular[4],
        book5: book[4],
        rate5: rate[4],
        particular6: particular[5],
        book6: book[5],
        rate6: rate[5],
        particular7: particular[6],
        book7: book[6],
        rate7: rate[6],
        particular8: particular[7],
        book8: book[7],
        rate8: rate[7],
        particular9: particular[8],
        book9: book[8],
        rate9: rate[8],
        count,
        noOfCopies: tempNoOfCopies,
        totalamt: tempTotalAmount.toFixed(2),
        pendingamt: parseFloat(pendingAmount).toFixed(2),
        paid: "",
        paymentId: "",
        paymentStatus: "",
        paymentRef: "",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setQueryData({...response.data.result[0]});
          setStatus("success");
        } else {
          setStatus("warn");
        }
      })
      .catch(function (error) {
        setStatus("error");
      });
  };

  const newOrder = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleOrderSearch = async (e) => {
    e.preventDefault();
    setEnableForm(false);
    setSearchStatus('');
    await axios({
      method: "post",
      url: "/order",
      data: {
        searchOrderId,
      },
    })
      .then(function (response) {
  
        if (response.status === 200) {
     
          if (response.data.result.length > 0) {
            setDisableSubmit(false);
            let particularExt= [];
            let bookExt = []
            let rateExt = []

            particularExt[0] = response.data.result[0].particular1;
            particularExt[1] = response.data.result[0].particular2;
            particularExt[2] = response.data.result[0].particular3;
            particularExt[3] = response.data.result[0].particular4;
            particularExt[4] = response.data.result[0].particular5;
            particularExt[5] = response.data.result[0].particular6;
            particularExt[6] = response.data.result[0].particular7;
            particularExt[7] = response.data.result[0].particular8;
            particularExt[8] = response.data.result[0].particular9;

            bookExt[0] = response.data.result[0].book1;
            bookExt[1] = response.data.result[0].book2;
            bookExt[2] = response.data.result[0].book3;
            bookExt[3] = response.data.result[0].book4;
            bookExt[4] = response.data.result[0].book5;
            bookExt[5] = response.data.result[0].book6;
            bookExt[6] = response.data.result[0].book7;
            bookExt[7] = response.data.result[0].book8;
            bookExt[8] = response.data.result[0].book9;

            rateExt[0] = response.data.result[0].rate1;
            rateExt[1] = response.data.result[0].rate2;
            rateExt[2] = response.data.result[0].rate3;
            rateExt[3] = response.data.result[0].rate4;
            rateExt[4] = response.data.result[0].rate5;
            rateExt[5] = response.data.result[0].rate6;
            rateExt[6] = response.data.result[0].rate7;
            rateExt[7] = response.data.result[0].rate8;
            rateExt[8] = response.data.result[0].rate9;

            setEnableForm(true);
            setName(response.data.result[0].name);
            setPhone(response.data.result[0].phone);
setGst(response.data.result[0].gst);
setCode(response.data.result[0].code);
setAddress(response.data.result[0].address);
setParticular([...particularExt]);
setBook([...bookExt]);
setRate([...rateExt]);
setCount(response.data.result[0].count);
setNoOfCopies(response.data.result[0].noOfCopies);
setTotalAmount(response.data.result[0].totalamt);
setOrderId(response.data.result[0].orderid);
setPendingAmount(response.data.result[0].pendingamt);
          } else {
          setSearchStatus("no data");
          }
        } else {
          setSearchStatus("warn");
        }
      })
      .catch(function (error) {
        setSearchStatus("error");
      });
  };

  /* Test */

  let formArray = [];

  for (let i = 0; i < count; i++) {
    let dummmyFormArray = (
      <div
        className="grid md:grid-cols-3 md:gap-9 border-dotted border-2 border-orange-600 rounded-lg p-3 m-2 z-50"
        key={i}
      >
        <div className="mb-5">
          <label
            htmlFor={particular[i]}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Particulars
          </label>
          <input
            type="text"
            name={particular[i]}
            id={particular[i]}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            onChange={(e) => updateParticularAtIndex(i, e.target.value)}
            value={particular[i]}
            placeholder="Particular"
            required
            disabled={disableSubmit}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor={book[i]}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Book/copies
          </label>
          <input
            type="number"
            name={book[i]}
            id={book[i]}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="Book/Copies"
            onChange={(e) => updateBookAtIndex(i, e.target.value)}
            value={book[i]}
            required
            disabled={disableSubmit}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor={rate[i]}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rate
          </label>
          <input
            type="number"
            name={rate[i]}
            id={rate[i]}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="Rate"
            onChange={(e) => updateRateAtIndex(i, e.target.value)}
            value={rate[i]}
            required
            disabled={disableSubmit}
          />
        </div>
      </div>
    );
    formArray.push(dummmyFormArray);
  }

  let statusDiv;

  if (status === "success" || searchStatus === "success") {
    statusDiv = (
      <div
        className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">
            Order {orderId} Updated Successfully
          </span>
        </div>
      </div>
    );
  }

  if(status === 'no data' || searchStatus === 'no data' ) {
    statusDiv =   <div className="flex items-center p-4 mt-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
    <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span className="sr-only">Info</span>
    <div>
      <span className="font-medium">Data not found!</span>
    </div>
  </div>
}

  if (status === "warn" || searchStatus === "warn") {
    statusDiv = (
      <div
        className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">Order Creation have some issue!</span>{" "}
          Please connect with technical team.
        </div>
      </div>
    );
  }

  if (status === "error" || searchStatus === "error") {
    statusDiv = (
      <div
        className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">Server Not responding!</span> Please
          connect with technical team.
        </div>
      </div>
    );
  }

  return (
    <>
      {login ? (
        <div className="z-50">
          <h2 className="text-center mb-4 text-orange-500 leading-none tracking-tight text-xl mt-3">
            Order Update
          </h2>

          <div className="max-w-4xl mx-auto border-solid border-2 border-orange-600 p-5 rounded-lg m-2">
            <div className="grid md:grid-cols-2 md:gap-9">
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Order Number
                </label>
                <input
                  type="text"
                  name="searchOrderId"
                  id="searchOrderId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                  placeholder="order Number"
                  required
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                />
              </div>
              <div className="mt-7">
                <button
                  onClick={handleOrderSearch}
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                >
                  Search
                </button>
              </div>

              {searchStatus && statusDiv}
            </div>
          </div>

          {enableForm && (
            <form
              className="max-w-4xl mx-auto border-solid border-2 border-orange-600 p-5 rounded-lg m-2"
              onSubmit={handleSubmit}
            >
              <div className="grid md:grid-cols-2 md:gap-9">
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={disableSubmit}
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    pattern="\d{10}"
                    name="phone"
                    id="phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                    placeholder="Mobile NUmber"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    required
                    disabled={disableSubmit}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-4 md:gap-9">
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Party GST
                  </label>
                  <input
                    type="text"
                    name="gst"
                    id="gst"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                    placeholder="Party GST"
                    onChange={(e) => setGst(e.target.value)}
                    value={gst}
                    required
                    disabled={disableSubmit}
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    State Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                    placeholder="State code"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                    required
                    disabled={disableSubmit}
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Pending Amount
                  </label>
                  <input
                    type="number"
                    name="pendingAmount"
                    id="pendingAmount"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                    placeholder="pendingAmount"
                    onChange={(e) => setPendingAmount(e.target.value)}
                    value={pendingAmount}
                    required
                    disabled={disableSubmit}
                  />
                </div>
                { disableSubmit &&
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Total Amount
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    id="totalAmount"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                    placeholder="totalAmount"
                    onChange={(e) => setTotalAmount(e.target.value)}
                    value={totalAmount}
                    required
                    disabled={disableSubmit}
                  />
                </div>
}
              </div>
              <div className="grid md:grid-cols-1 md:gap-9">
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                    placeholder="Address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    required
                    disabled={disableSubmit}
                  />
                </div>
        
              </div>
              {formArray}
              {!disableSubmit && count < 8 && (
                <div className="flex justify-end mb-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                    onClick={incrementCount}
                  >
                    Add
                  </button>
                </div>
              )}
              {!disableSubmit && (
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                    disabled={disableSubmit}
                  >
                    Update
                  </button>
                </div>
              )}
              {disableSubmit && statusDiv}

              {disableSubmit &&      <div className="flex justify-center md:gap-20">
          <button
            type="button"
            onClick={newOrder}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            New Order Update
          </button>
          <div>
      <button  onClick={fillForm} type="button" data-tooltip-target="tooltip-download" data-tooltip-placement="left" class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
                <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Download</span>
        </button>
        <div id="tooltip-download" role="tooltip" class="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Download
            <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
		</div> 
        </div>}
            </form>
          )}
        </div>
      ) : (
        <Navigate to="/form" replace />
      )}
    </>
  );
};

export default OrderUpdate;
