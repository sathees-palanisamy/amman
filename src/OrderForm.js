import * as React from "react";

const OrderForm = () => {
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

  const handleSubmit = (e) => {
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

    console.log('----------------');
    console.log('name:', name);
    console.log('phone:', phone);
    console.log('gst:', gst);
    console.log('code:', code);
    console.log('address:', address);
    console.log('particular:', particular);
    console.log('book:', book);
    console.log('rate:', rate);
    console.log('count:',count);
    console.log('noOfCopies:', noOfCopies);
    console.log('totalAmount:', totalAmount);

    const newObj = {name,phone,gst,code,address,particular,book,rate,count,tempNoOfCopies,tempTotalAmount}
    console.log(newObj);
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
          />
        </div>
      </div>
    );
    formArray.push(dummmyFormArray);
  }

  console.log('----------------');
  console.log('name:', name);
  console.log('phone:', phone);
  console.log('gst:', gst);
  console.log('code:', code);
  console.log('address:', address);
  console.log('particular:', particular);
  console.log('book:', book);
  console.log('rate:', rate);
  console.log('count:',count);
  console.log('noOfCopies:', noOfCopies);
  console.log('totalAmount:', totalAmount);

  return (
    <div>
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
      </form>
    </div>
  );
};

export default OrderForm;
