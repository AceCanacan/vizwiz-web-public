import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import '../App.css';

function CsvUploader({ setCsvHeaders, csvHeaders }) {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileName(file.name);

    Papa.parse(file, {
      complete: (result) => {
        const headers = result.meta.fields;
        const data = result.data.slice(0, 5);  // Limit to first 5 rows
        setCsvHeaders(headers);
        setCsvData(data);
      },
      header: true,
    });
  };


  const handleSubmit = () => {

    if (csvHeaders.length > 0) {
      navigate('/interpret');  // Navigate to the Header_Interpret component
    } else {
      alert('Please upload a CSV file before proceeding.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  return (
    <div className="app-container">
      <a href="#" {...getRootProps()} className="dropzone">
        Upload CSV File
        <input {...getInputProps()} />
      </a>
      {fileName && <h2>CSV File: {fileName}</h2>}  {/* Conditional rendering based on fileName */}
      {csvData.length > 0 && (
        <div>
          <h2>Head of Dataframe:</h2>
          <div className="scrollable-table"> {/* Scrollable part */}
            <table>
              <thead>
                <tr>
                  {csvHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, index) => (
                  <tr key={index}>
                    {csvHeaders.map((header) => (
                      <td key={header}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <button className="reusable-button" onClick={handleSubmit}>Submit</button>  {/* Submit Button */}
    </div>
  );
}

export default CsvUploader;
