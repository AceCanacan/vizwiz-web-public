import React, { useState, useCallback,useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = "INSERT API KEY";

const GenerateQuestions = ({ datasetDescription, columnInfo }) => {
  const [generatedQuestions, setGeneratedQuestions] = useState('');
  const [generatedML, setGeneratedML] = useState('');
  const [generatedFtrEngg, setGeneratedFtrEngg] = useState('');
  const [generatedCleaning, setGeneratedCleaning] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMode, setCurrentMode] = useState('');

  
  const generateMLPrompt = () => {
    return `Dataset description: ${datasetDescription}. Columns: ${Object.entries(columnInfo).map(([k, v]) => `${k} - ${v}`).join(', ')}. ` +
           "Create a basic machine learning model with steps. " +
           "First, provide a brief general description of what the machine learning model might look like. " +
           "Then, print the steps to build the model in Python block codes.";
  };
  const generateML = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generateMLPrompt();
      const systemMessage = {
        role: 'system',
        content: prompt,
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
      setGeneratedML(response.data.choices[0].message.content.trim());  // Set the generated machine learning model
    } catch (e) {
      setError('An error occurred while generating the machine learning model.');
    }
    setLoading(false);
  }, [datasetDescription, columnInfo]);

  const generatePrompt = () => {
    return `Dataset description: ${datasetDescription}. Columns: ${Object.entries(columnInfo).map(([k, v]) => `${k} - ${v}`).join(', ')}. ` +
           "'Distribution', 'Relationship', 'Composition', 'Comparison'" +
           "Hey ChatGPT, your goal here is that given this set of information about the dataset. You are tasked to create questions about it that can be answered through data visualization practices in Python. Each question should have a sample code in Python on how it can be inputted to a Jupyter Notebook." +
           "It is imperative that EACH QUESTION has A SAMPLE CODE. " +
           "These are the types of analyses that should be outputted. At least one question will be generated per analysis type. More may be generated if possible. " +
           "Make a set of questions per each type. For example, output questions that are based on distribution. And output another set of questions for relationship. " +
           "I emphasize that each question needs to have its own block of code. " +
           "Assume that the dataset is loaded into a pandas DataFrame named 'df'. " +
           "Make a block of code that will include all the codes for prerequisites. Such as importing necessary libraries and loading the file from a CSV file.";
  };

  const generateQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generatePrompt();
      const systemMessage = {
        role: 'system',
        content: prompt,
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
      setGeneratedQuestions(response.data.choices[0].message.content.trim());
    } catch (e) {
      setError('An error occurred while generating questions.');
    }
    setLoading(false);
  }, [datasetDescription, columnInfo]);

  const generateFtrEnggPrompt = () => {
    return `Dataset description: ${datasetDescription}. Columns: ${Object.entries(columnInfo).map(([k, v]) => `${k} - ${v}`).join(', ')}. ` +
           "What potential feature engineering can you come up with? " +
           "Make sure to generate code for each type of feature engineering. " +
           "Print them in Python block codes.";
  };

  const generateCleaningPrompt = () => {
    return `Dataset description: ${datasetDescription}. Columns: ${Object.entries(columnInfo).map(([k, v]) => `${k} - ${v}`).join(', ')}. ` +
           "What potential data cleaning codes can you come up with? " +
           "Make sure to generate code for each type of feature engineering. " +
           "Print them in Python block codes.";
  };

  const generateFtrEngg = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generateFtrEnggPrompt();
      const systemMessage = {
        role: 'system',
        content: prompt,
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
      setGeneratedFtrEngg(response.data.choices[0].message.content.trim());
    } catch (e) {
      setError('An error occurred while generating feature engineering codes.');
    }
    setLoading(false);
  }, [datasetDescription, columnInfo]);

  const generateCleaning = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generateCleaningPrompt();
      const systemMessage = {
        role: 'system',
        content: prompt,
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
      setGeneratedCleaning(response.data.choices[0].message.content.trim());
    } catch (e) {
      setError('An error occurred while generating data cleaning codes.');
    }
    setLoading(false);
  }, [datasetDescription, columnInfo]);


  
  const callAPIIfEmpty = useCallback((mode) => {
    if (mode === 'visualization' && !generatedQuestions) {
      generateQuestions();
    } else if (mode === 'ML' && !generatedML) {
      generateML();
    }
  }, [generatedQuestions, generatedML, generateQuestions, generateML]);

  useEffect(() => {
    // Update to handle all modes
    if (currentMode === 'visualization' && !generatedQuestions) {
      generateQuestions();
    } else if (currentMode === 'ML' && !generatedML) {
      generateML();
    } else if (currentMode === 'FtrEngg' && !generatedFtrEngg) {
      generateFtrEngg();
    } else if (currentMode === 'Cleaning' && !generatedCleaning) {
      generateCleaning();
    }
  }, [currentMode, generatedQuestions, generatedML, generatedFtrEngg, generatedCleaning,
      generateQuestions, generateML, generateFtrEngg, generateCleaning]);

  const handleGenerateQuestionsClick = useCallback(() => {
    setCurrentMode('visualization');
  }, []);

  const handleGenerateMLClick = useCallback(() => {
    setCurrentMode('ML');
  }, []);
  
  const handleGenerateFtrEnggClick = useCallback(() => {
    setCurrentMode('FtrEngg');
  }, []);
  
  const handleGenerateCleaningClick = useCallback(() => {
    setCurrentMode('Cleaning'); // Clear previous content
  }, []);

  const getHeader = () => {
    if (currentMode === 'visualization') {
      return 'Visualization Suggestions';
    } else if (currentMode === 'ML') {
      return 'Machine Learning Suggestions';
    } else if (currentMode === 'FtrEngg') {
      return 'Feature Engineering Suggestions';
    } else if (currentMode === 'Cleaning') {
      return 'Data Cleaning Suggestions';
    }
    return '';
  };

  const handleRefreshClick = useCallback(() => {
    if (currentMode === 'visualization') {
      generateQuestions();
    } else if (currentMode === 'ML') {
      generateML();
    } else if (currentMode === 'FtrEngg') {
      generateFtrEngg();
    } else if (currentMode === 'Cleaning') {
      generateCleaning();
    }
  }, [currentMode, generateQuestions, generateML, generateFtrEngg, generateCleaning]);


return (
  <div>
    <button className="reusable-button-output" onClick={handleGenerateQuestionsClick}>Visualization</button>
    <button className="reusable-button-output" onClick={handleGenerateMLClick}>ML Model</button>
    <button className="reusable-button-output" onClick={handleGenerateFtrEnggClick}>Feature Engg</button>
    <button className="reusable-button-output" onClick={handleGenerateCleaningClick}>Data Cleaning</button>
    
    {currentMode && <button className="reusable-button" onClick={handleRefreshClick}>Refresh</button>}
    <h2>{getHeader()}</h2>
    
    <div className="output-box">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {currentMode && 
        <div dangerouslySetInnerHTML={{
          __html: {
            'visualization': generatedQuestions,
            'ML': generatedML,
            'FtrEngg': generatedFtrEngg,
            'Cleaning': generatedCleaning
          }[currentMode].replace(/\n/g, '<br />').replace(/```python/g, '<pre>').replace(/```/g, '</pre>')
        }} />
      }
    </div>
  </div>
);

};

export default GenerateQuestions;
