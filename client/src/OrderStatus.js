import * as React from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// axios.defaults.baseURL = 'http://localhost:5001';

const OrderStatus = () => {
  const saved = localStorage.getItem("login");
  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState('');
  const [data, setData] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios({
      method: 'post',
      url: '/search',
      data: {
           name,
      }
  })
      .then(function (response) {
          if (response.status === 200) {
              if (response.data.result.length > 0 ){
                setStatus('success');
                setName('');
                setData([...response.data.result]);
              } else {
                setStatus('no data');
                setData([]);
              }
          }
          else {
            setStatus('warn');
            setData([]);
          }
      })
      .catch(function (error) {
          setStatus('error');
          setData([]);
      });
  }

  let tableRow = [];

  for (let i = 0; i < data.length; i++) {
    let dummmyData = (
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].orderDate}
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].totalamt}
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].orderid}
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].phone}
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data[i].name}
        </td>
      </tr>
    );
    tableRow.push(dummmyData);
  }

  let statusDiv;

  if(status === 'no data') {
    statusDiv =   <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
    <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span className="sr-only">Info</span>
    <div>
      <span className="font-medium">Data not found!</span>
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
    <span className="font-medium">Search have some issue!</span> Please connect with technical team.
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
    <>{saved ?  
      <div className="z-50"><h2 className="text-center mb-4 text-orange-500 leading-none tracking-tight text-xl mt-3 z-50">
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
              onClick={handleSubmit}
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
                  <th className="px-6 py-3">Order Number</th>
                  <th className="px-6 py-3">Mobile Number</th>
                  <th className="px-6 py-3">Name</th>
                </tr>
              </thead>
              <tbody>{tableRow}</tbody>
            </table>
          </div>
        )}
        {statusDiv}
      </div>  </div>: <Navigate to="/" replace />}
    </>
  );
};

export default OrderStatus;
