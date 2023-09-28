import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = "INSERT API KEY";

const Header_Interpret = ({ csvHeaders, onInterpretationComplete }) => {
  const [interpretations, setInterpretations] = useState({});
  const [datasetInterpretation, setDatasetInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationCompleted, setOperationCompleted] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/GenerateQuestions');
  }

  const interpretHeader = useCallback(async (header) => {
    try {
      const systemMessage = {
        role: 'system',
        content: `Interpret the CSV column header "${header}" in a very brief but detailed manner. Not more than two sentences`,
      };
      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [systemMessage],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
  if (error.response) {
    console.error('Error response from OpenAI:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('Error request sent to OpenAI:', error.request);
  } else {
    console.error('Error in setting up the request:', error.message);
  }
  return `Error: ${error.response ? error.response.status : 'Unknown Error'}`;
}

  }, []);

  const interpretDataset = useCallback(async () => {
    try {
      const systemMessage = {
        role: 'system',
        content: `Provide an overall interpretation of a dataset in 2 sentences: ${csvHeaders.join(', ')}`,
      };
      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [systemMessage],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error response from OpenAI:', error.response?.data);
      return 'Error interpreting dataset';
    }
  }, [csvHeaders]);


  const interpretHeadersAndDataset = async () => {
    if (operationCompleted) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const headerPromises = csvHeaders.map(header => interpretHeader(header));
      const [headerResults, datasetResult] = await Promise.all([
        Promise.all(headerPromises),
        interpretDataset(),
      ]);

      const newInterpretations = {};
      csvHeaders.forEach((header, index) => {
        newInterpretations[header] = headerResults[index];
      });

      setInterpretations(newInterpretations);
      setDatasetInterpretation(datasetResult);

        // Inform the parent component that the interpretation is complete
  if (onInterpretationComplete) {
    onInterpretationComplete(datasetResult, newInterpretations);
  }

  setLoading(false);
  setOperationCompleted(true); 
      
    } catch (e) {
      setError('An error occurred while interpreting the data.');
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    interpretHeadersAndDataset();
  }, []);  

  return (
    <>
      {loading && <p>Loading interpretations...</p>}
      {datasetInterpretation && (
        <div className="rounded-box centered-content">
          <div className="header-title">Overall Dataset Interpretation</div>
          <textarea
            className="rounded-input"
            value={datasetInterpretation}
            onChange={(e) => setDatasetInterpretation(e.target.value)}
          />
        </div>
      )}
      {Object.keys(interpretations).length > 0 && (
        <div className="rounded-box centered-content">
          <div className="header-title">Header Interpretations</div>
          {Object.entries(interpretations).map(([header, interpretation]) => (
            <div key={header}>
              <div className="header-label"><strong>{header}:</strong></div>
              <input
                className="rounded-input"
                type="text"
                value={interpretation}
                onChange={(e) => {
                  setInterpretations({
                    ...interpretations,
                    [header]: e.target.value,
                  });
                }}
              />
            </div>
          ))}
          <button className="reusable-button" onClick={handleNavigation}>Submit</button>
        </div>
      )}
      {error && <p>{error}</p>}
    </>
  );
};

export default Header_Interpret;
