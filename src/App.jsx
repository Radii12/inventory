
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
let count=0
function App() {
  
const [excelData, setExcelData] = useState(() => {
  try {
    const savedData = localStorage.getItem("data");
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
   return [];
  }
});
useEffect(() => {
  localStorage.setItem("data", JSON.stringify(excelData));
}, [excelData]);
const [excelDataEletedItems, setExcelDataDletedItmes] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [quantity, setQuantity] = useState("");
const onDownloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  XLSX.writeFile(workbook, "Products.xlsx");
};
  const onChangeItems = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, {
        type: 'array',
      });

      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        throw new Error('The Excel file has no worksheets.');
      }

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return;
      }

      const firstRow = data[0];
      
      setExcelData(()=>data);

      setQuantity(String(firstRow.QuantityInPOS ?? ''));

    } catch (error) {
    }
  };

  {/*deleted item*/}
  const onChangeDeletedItem = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, {
        type: 'array',
      });

      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        throw new Error('The Excel file has no worksheets.');
      }

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        console.warn('The Excel worksheet is empty.');
        return;
      }

      const firstRow = data[0];

      setExcelDataDletedItmes(()=>data);

      
      {/* setQuantity(String(firstRow.QuantityInPOS ?? '')); */}

    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };
  const onChangeQuntity = (e,index) => {
  const value = e.target.value;

  setExcelData((prev) =>
    prev.map((item, i) =>
      i === index
        ? { ...item, "Quantity In POS": value }
        : item
    )
  );
};

  return (
    <div className="flex  min-h-screen flex-col items-center gap-4 bg-red-200 ">
  <div className='flex  gap-5 w-full justify-around'>
        {/* Excel upload */}
      <div className="flex w-full max-w-md mt-11 flex-col gap-3">
        <label
          htmlFor="excel-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-blue-500 hover:bg-blue-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mb-3 h-10 w-10 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0L8 8m4-4 4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
            />
          </svg>

          <span className="text-sm font-semibold text-gray-700">
            Click to upload Excel file
          </span>

          <span className="mt-1 text-xs text-gray-500">
            XLSX or XLS
          </span>

          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={onChangeItems}
            className="sr-only"
          />
        </label>
      </div>
      {/* Search bar */}

  { /* <div className="flex w-full max-w-md flex-col gap-3">
        <label
          htmlFor="excell-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-blue-500 hover:bg-blue-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mb-3 h-10 w-10 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0L8 8m4-4 4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
            />
          </svg>

          <span className="text-sm font-semibold text-gray-700">
            Click to upload deleted items file
          </span>

          <span className="mt-1 text-xs text-gray-500">
            XLSX or XLS
          </span>

          <input
            id="excell-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={onChangeDeletedItem}
            className="sr-only"
          />
        </label>
      </div>*/}
  
  </div>
<div className="w-full max-w-md px-4">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search product by name..."
    className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  />
</div>
      {/* Product information */}
      <div className="w-full gap-5 justify-center flex-1 flex flex-wrap rounded-xl  p-4">
        
{excelData
  ?.filter((data) =>
    String(data["Product Name"] ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
  )
  .map((data, index) => (
 <React.Fragment key={index}>
 {data["Quantity In POS"] !=='0.000'&& <div

    className="mb-4  max-w-md rounded-xl bg-amber-700 p-5"
  >
    <label
      htmlFor={`productName-${index}`}
      className="mb-2 block text-sm font-semibold text-white"
    >
      Product Name
    </label>

    <input
      id={`productName-${index}`}
      type="text"
      value={data["Product Name"] ?? ""}
      onChange={(e) =>
        setExcelData((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, ProductName: e.target.value }
              : item
          )
        )
      }
      placeholder="Enter product name..."
      className="mb-4 h-10 w-full rounded-lg border border-amber-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-300"
    />

    <label
      htmlFor={`quantity-${index}`}
      className="mb-2 block text-sm font-semibold text-white"
    >
      Quantity
    </label>

    <input
      id={`quantity-${index}`}
      type="number"
      value={data['Quantity In POS'] }
      onChange={(e) => onChangeQuntity(e, index)}
      placeholder="Enter item quantity..."
      className="h-10 w-full rounded-lg border border-amber-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-300"
    />
  </div>}
  </React.Fragment>
))}

      </div>
      <div className="mb-10 flex w-full max-w-md flex-col gap-3">
  <button
    type="button"
    onClick={onDownloadExcel}
    disabled={excelData.length === 0}
    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mb-3 h-10 w-10 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v12m0 0 4-4m-4 4-4-4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"
      />
    </svg>

    <span className="text-sm font-semibold text-gray-700">
      Download Excel file
    </span>

    <span className="mt-1 text-xs text-gray-500">
      Download as XLSX
    </span>
  </button>
</div>
    </div>
  );
}

export default App;
