import * as React from "react";

const OrderForm = () => {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gst, setGst] = React.useState("");
  const [code, setCode] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [particular1, setParticular1] = React.useState("");
  const [book1, setBook1] = React.useState("");
  const [rate1, setRate1] = React.useState("");
  const [amount1, setAmount1] = React.useState("");

  const [particular2, setParticular2] = React.useState("");
  const [book2, setBook2] = React.useState("");
  const [rate2, setRate2] = React.useState("");
  const [amount2, setAmount2] = React.useState("");

  return (
    <div>
      <h2 className="text-center mb-4 text-orange-500 text-2xl leading-none tracking-tight text-orange-900 md:text-2xl lg:text-2xl dark:text-white mt-3">
        Order Form
      </h2>

      <form className="max-w-4xl mx-auto border-solid border-2 border-orange-600 p-5 rounded-lg m-2">
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
              placeholder=" "
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
              placeholder=" "
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
              placeholder=" "
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
              placeholder=" "
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
              placeholder=" "
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-4 md:gap-9 border-dotted border-2 border-orange-600 rounded-lg p-3 m-2">
          <div className="mb-5">
            <label
              htmlFor="particular1"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Particulars
            </label>
            <input
              type="text"
              name="particular1"
              id="particular1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              onChange={(e) => setParticular1(e.target.value)}
              value={particular1}
              placeholder=" "
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="book1"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Book/copies
            </label>
            <input
              type="text"
              name="book1"
              id="book1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder=" "
              onChange={(e) => setBook1(e.target.value)}
              value={book1}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="rate1"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Rate
            </label>
            <input
              type="text"
              name="rate1"
              id="rate1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder=" "
              onChange={(e) => setRate1(e.target.value)}
              value={rate1}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="amount1"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Amount
            </label>
            <input
              type="text"
              name="amount1"
              id="amount1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder=" "
              onChange={(e) => setAmount1(e.target.value)}
              value={amount1}
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-4 md:gap-9 border-dotted border-2 border-orange-600 rounded-lg p-3 m-2">
          <div className="mb-5">
            <label
              htmlFor="particular2"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Particulars
            </label>
            <input
              type="text"
              name="particular2"
              id="particular2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder=" "
              onChange={(e) => setParticular2(e.target.value)}
              value={particular2}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="book2"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Book/copies
            </label>
            <input
              type="text"
              name="book2"
              id="book2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder=" "
              onChange={(e) => setBook2(e.target.value)}
              value={book2}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="rate2"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Rate
            </label>
            <input
              type="text"
              name="rate2"
              id="rate2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder=" "
              onChange={(e) => setRate2(e.target.value)}
              value={rate2}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="amount2"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Amount
            </label>
            <input
              type="text"
              name="amount2"
              id="amount2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder=" "
              onChange={(e) => setAmount2(e.target.value)}
              value={amount2}
              required
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
