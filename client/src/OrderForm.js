import * as React from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5001';

const OrderForm = () => {
  const saved = localStorage.getItem("login");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gst, setGst] = React.useState("");
  const [code, setCode] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [particular, setParticular] = React.useState([]);
  const [book, setBook] = React.useState([]);
  const [rate, setRate] = React.useState([]);
  const [disableSubmit, setDisableSubmit] = React.useState(false);

  const [count, setCount] = React.useState(1);

  const [noOfCopies, setNoOfCopies] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [status, setStatus] = React.useState('');
  const [orderId,setOrderId] = React.useState('');

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
    setCount((prevCounter) => prevCounter + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempNoOfCopies = 0;
    let tempTotalAmount = 0;

    for (let i = 0; i < count; i++) {
      tempNoOfCopies = tempNoOfCopies + parseFloat(book[i]);
      tempTotalAmount =  tempTotalAmount + parseFloat(book[i]) * parseFloat(rate[i]);
    }

    setNoOfCopies(tempNoOfCopies);
    setTotalAmount(tempTotalAmount);
    setDisableSubmit(true);

    await axios({
      method: 'post',
      url: '/create',
      data: {
          name ,
          phone ,
          gst ,
          code ,
          address ,
          particular1: particular[0] ,
          book1:  book[0],
          rate1: rate[0],
          particular2: particular[1] ,
          book2:  book[1],
          rate2: rate[1],
          particular3: particular[2] ,
          book3:  book[2],
          rate3: rate[2],
          particular4: particular[3] ,
          book4:  book[3],
          rate4: rate[3],
          particular5: particular[4] ,
          book5:  book[4],
          rate5: rate[4],
          particular6: particular[5] ,
          book6:  book[5],
          rate6: rate[5],
          particular7: particular[6] ,
          book7:  book[6],
          rate7: rate[6],
          particular8: particular[7] ,
          book8:  book[7],
          rate8: rate[7],
          particular9: particular[8] ,
          book9:  book[8],
          rate9: rate[8],
          count,
          noOfCopies: tempNoOfCopies,
          totalamt: tempTotalAmount,
          pendingamt: tempTotalAmount,
          paid: '',
          paymentId: '',
          paymentStatus: '',
          paymentRef: ''
      }
  })
      .then(function (response) {
  
          if (response.status === 200){ 
            setOrderId(response.data.orderid);
          setStatus('success');
          } else {
            setStatus('warn')
          }
      }).catch(function (error) {
          setStatus('error')
      });
  }

  const newOrder = (e) => {
    e.preventDefault();
    window.location.reload()

  }


  let formArray = [];

  for (let i = 0; i < count; i++) {
    let dummmyFormArray = (
      <div className="grid md:grid-cols-3 md:gap-9 border-dotted border-2 border-orange-600 rounded-lg p-3 m-2" key={i}>
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
            type="text"
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
            type="text"
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

  if(status === 'success') {
      statusDiv =   <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
      <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">Order Created Successfully with number {orderId}</span> Please click new order for new order creation.
      </div>
    </div>
  }

  if(status === 'warn') {
    statusDiv =   <div className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
    <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span className="sr-only">Info</span>
    <div>
      <span className="font-medium">Order Creation have some issue!</span> Please connect with technical team.
    </div>
  </div>
}

if(status === 'error') {
  statusDiv = <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
  <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span className="sr-only">Info</span>
  <div>
    <span className="font-medium">Server Not responding!</span> Please connect with technical team.
  </div>
</div>
}

  return (
    <>{saved ?     <div>
      <h2 className="text-center mb-4 text-orange-500 leading-none tracking-tight text-xl mt-3">
        Order Form
      </h2>

      <form className="max-w-4xl mx-auto border-solid border-2 border-orange-600 p-5 rounded-lg m-2" onSubmit={handleSubmit}>
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
        <div className="grid md:grid-cols-2 md:gap-9">
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
        { !disableSubmit &&
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={incrementCount}
          >
            Add
          </button>
        </div>
}
        { !disableSubmit &&
        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
            disabled={disableSubmit}
          >
            Submit
          </button>
        </div>
        }
            {statusDiv} 
      </form>

      { disableSubmit &&
        <div className="flex justify-center">
          <button
            type="button"
            onClick={newOrder}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            New Order
          </button>
        </div>
        }
  
    </div> : <Navigate to="/" replace />}</>

  );
};

export default OrderForm;
