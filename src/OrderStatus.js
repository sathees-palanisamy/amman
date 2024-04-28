import * as React from "react";

const OrderStatus = () => {
  const [name, setName] = React.useState("");

  const data = [
    {
      name: "Sathees Kumar",
      phone: "9003474248",
      gst: "GST01",
      code: "33",
      address: "203,Karandipalayam,kattuvalavu,Grey nagar",
      particular: ["P1", "P2"],
      book: ["10", "20"],
      rate: ["100", "200"],
      count: 2,
      noOfCopies: 30,
      totalAmount: 5000,
      createTimeStamp: "2021-12-31 23:59:59",
    },
    {
      name: "Sathees Kumar",
      phone: "9003474248",
      gst: "GST01",
      code: "33",
      address: "203,Karandipalayam,kattuvalavu,Grey nagar",
      particular: ["P1", "P2"],
      book: ["1", "10"],
      rate: ["2", "200"],
      count: 2,
      noOfCopies: 3,
      totalAmount: 410,
      createTimeStamp: "2022-12-31 23:59:59",
    },
    {
      name: "Sathees Kumar",
      phone: "9003474248",
      gst: "GST01",
      code: "33",
      address: "203,Karandipalayam,kattuvalavu,Grey nagar",
      particular: ["P1", "P2"],
      book: ["2", "1"],
      rate: ["5", "2"],
      count: 2,
      noOfCopies: 7,
      totalAmount: 12,
      createTimeStamp: "2023-12-31 23:59:59",
    },
  ];

  let tableRow = [];

  for (let i = 0; i < data.length; i++) {
    let dummmyData = (
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].createTimeStamp.substring(0, 10)}
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].totalAmount}
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].phone}
        </td>
      </tr>
    );
    tableRow.push(dummmyData);
  }

  return (
    <>
      <h2 className="text-center mb-4 text-orange-500 leading-none tracking-tight text-xl mt-3">
        Order Search
      </h2>
      <div className="max-w-4xl mx-auto border-solid border-2 border-orange-600 p-5 rounded-lg m-2">
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
          <div className="mt-7">
            <button
              type="submit"
              className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
            >
              Search
            </button>
          </div>
        </div>
        {data.length > 0 && (
          <div className="relative overflow-x-auto p-2">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Mobile Number</th>
                </tr>
              </thead>
              <tbody>{tableRow}</tbody>
            </table>
          </div>
        )}
        {data.length == 0 && <div>Data Not Found</div>}
      </div>
    </>
  );
};

export default OrderStatus;
