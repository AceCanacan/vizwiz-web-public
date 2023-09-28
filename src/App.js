import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CsvUploader from './components/CsvUploader';
import Header_Interpret from './components/header_interpret';
import GenerateQuestions from './components/GenerateQuestions';
import './App.css';

function App() {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [showInterpretations, setShowInterpretations] = useState(false);
  const [datasetInterpretation, setDatasetInterpretation] = useState('');
  const [columnInterpretations, setColumnInterpretations] = useState({});

  const handleInterpretHeaders = () => {
    setShowInterpretations(true);
  };

  const handleInterpretationResults = (datasetInterpretation, columnInterpretations) => {
    setDatasetInterpretation(datasetInterpretation);
    setColumnInterpretations(columnInterpretations);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="app-container">
          <header className="app-header">
          </header>
          <div className="app-content">
            <Routes>
              <Route index element={<CsvUploader setCsvHeaders={setCsvHeaders} csvHeaders={csvHeaders} />} />
              <Route path="/GenerateQuestions" element={<GenerateQuestions datasetDescription={datasetInterpretation} columnInfo={columnInterpretations} />}/>
              <Route path="/interpret" element={<Header_Interpret csvHeaders={csvHeaders} onInterpretationComplete={handleInterpretationResults} />} />
              <Route path="/GenerateQuestions" element={<GenerateQuestions />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
