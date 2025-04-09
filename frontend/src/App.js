import React, { useState, useEffect } from 'react';
import './styles.css'

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Reset file names when files change
    if (selectedFiles.length > 0) {
      const names = selectedFiles.map(file => file.name);
      setFileNames(names);
    } else {
      setFileNames([]);
    }
  }, [selectedFiles]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      setError("Please select exactly 4 video files.");
      setSelectedFiles([]);
      return;
    }
    setSelectedFiles(files);
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.includes('video'));
    if (files.length > 4) {
      setError("Please select exactly 4 video files.");
      return;
    }
    if (files.length > 0) {
      setSelectedFiles(files);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate file count
    if (selectedFiles.length !== 4) {
      setError("Please upload exactly 4 videos.");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('videos', file));

    try {
      // Simulate a progress interval for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      // Actual API call
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error.message || "Failed to upload videos. Please try again.");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon" style={{ color: '#2563eb' }}>
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              <h1 className="logo-text">AI Traffic Optimizer</h1>
            </div>
            <div className="header-subtitle">Smart Urban Solutions</div>
          </div>
        </div>
      </header>

      <main className="container">
        {!result ? (
          <div className="grid grid-cols-2">
            {/* Left Column - Info */}
            <div>
              <section className="blue-card">
                <h2 className="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Optimize Traffic Flow with AI
                </h2>
                <p>
                  Our advanced AI system analyzes traffic patterns in real-time to optimize 
                  traffic light timings at intersections, reducing congestion and improving overall flow.
                </p>
                <div className="feature-grid">
                  <div className="feature-item">
                    <p className="feature-title">Reduce Wait Times</p>
                    <p className="feature-description">Up to 30% reduction in average wait times</p>
                  </div>
                  <div className="feature-item">
                    <p className="feature-title">Improve Flow</p>
                    <p className="feature-description">Smoother traffic and fewer bottlenecks</p>
                  </div>
                  <div className="feature-item">
                    <p className="feature-title">Real-time Analysis</p>
                    <p className="feature-description">Dynamic adjustments based on current conditions</p>
                  </div>
                  <div className="feature-item">
                    <p className="feature-title">Environmental Impact</p>
                    <p className="feature-description">Reduced emissions from idling vehicles</p>
                  </div>
                </div>
              </section>

              <section className="card" style={{ marginTop: '1.5rem' }}>
                <h2 className="section-title">How It Works</h2>
                <ol className="steps">
                  <li className="step-item">
                    <div className="step-number">1</div>
                    <p className="step-text">Upload 4 videos showing different approaches to an intersection (North, South, East, West)</p>
                  </li>
                  <li className="step-item">
                    <div className="step-number">2</div>
                    <p className="step-text">Our AI analyzes traffic density, vehicle types, and movement patterns</p>
                  </li>
                  <li className="step-item">
                    <div className="step-number">3</div>
                    <p className="step-text">The system calculates optimal green light timing for each direction</p>
                  </li>
                  <li className="step-item">
                    <div className="step-number">4</div>
                    <p className="step-text">Implement the recommended timings to improve traffic flow</p>
                  </li>
                </ol>
              </section>
            </div>

            {/* Right Column - Upload Form */}
            <div>
              <section className="card" style={{ height: '100%' }}>
                <h2 className="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon" style={{ color: '#2563eb' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload Traffic Videos
                </h2>
                <p className="section-subtitle">
                  Select 4 videos showing different roads at an intersection (North, South, East, West). 
                  For best results, use 10-30 second clips of current traffic conditions.
                </p>

                {error && (
                  <div className="error-alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p className="error-message">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div 
                    className={`upload-area ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p className="upload-text">Drag and drop video files here, or</p>
                    <label className="browse-button">
                      Browse Files
                      <input 
                        type="file" 
                        multiple 
                        accept="video/*" 
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="upload-hint">Upload exactly 4 video files</p>
                  </div>

                  {fileNames.length > 0 && (
                    <div className="file-list">
                      <h3 className="file-list-title">Selected Files ({fileNames.length}/4):</h3>
                      <ul className="file-list-items">
                        {fileNames.map((name, index) => (
                          <li key={index} className="file-item">
                            <span className="file-name">{name}</span>
                            <button 
                              type="button" 
                              onClick={() => removeFile(index)}
                              className="remove-file"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={selectedFiles.length !== 4 || loading}
                    className={`button button-primary button-full`}
                    style={{ marginTop: '1.5rem' }}
                  >
                    {loading ? 'Processing...' : 'Analyze Traffic Data'}
                    {!loading && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    )}
                  </button>
                </form>

                {loading && (
                  <div className="progress-container">
                    <p className="progress-label">Processing videos... {Math.round(uploadProgress)}%</p>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="progress-text">This may take a few minutes depending on video size</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="results-header">
              <div className="results-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="results-title-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Traffic Light Optimization Results
              </div>
              <button 
                onClick={resetForm}
                className="new-analysis-btn"
              >
                Start New Analysis
              </button>
            </div>

            <div className="grid grid-cols-2">
              <div>
                <p className="results-description">
                  Based on our analysis of the traffic conditions in your videos, we've calculated 
                  the optimal green light durations for each approach to maximize traffic flow and 
                  minimize wait times.
                </p>

                <div className="info-box">
                  <h3 className="info-box-title">Implementation Notes:</h3>
                  <ul className="info-box-list">
                    <li className="info-box-item">• These timings are optimized for current traffic conditions shown in the videos</li>
                    <li className="info-box-item">• For best results, update timing patterns during different times of day</li>
                    <li className="info-box-item">• Consider implementing these timings during similar traffic conditions</li>
                  </ul>
                </div>
              </div>

              <div className="results-box">
                <h3 className="results-box-title">Recommended Green Light Durations</h3>
                
                <div className="results-grid">
                  <div className="direction-card">
                    <div className="direction-header">
                      <span className="direction-name">North Direction</span>
                      <span className="direction-time">
                        {result.north} seconds
                      </span>
                    </div>
                    <div className="time-bar-bg">
                      <div 
                        className="time-bar-fill" 
                        style={{ width: `${(result.north / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="direction-card">
                    <div className="direction-header">
                      <span className="direction-name">South Direction</span>
                      <span className="direction-time">
                        {result.south} seconds
                      </span>
                    </div>
                    <div className="time-bar-bg">
                      <div 
                        className="time-bar-fill" 
                        style={{ width: `${(result.south / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="direction-card">
                    <div className="direction-header">
                      <span className="direction-name">East Direction</span>
                      <span className="direction-time">
                        {result.east} seconds
                      </span>
                    </div>
                    <div className="time-bar-bg">
                      <div 
                        className="time-bar-fill" 
                        style={{ width: `${(result.east / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="direction-card">
                    <div className="direction-header">
                      <span className="direction-name">West Direction</span>
                      <span className="direction-time">
                        {result.west} seconds
                      </span>
                    </div>
                    <div className="time-bar-bg">
                      <div 
                        className="time-bar-fill" 
                        style={{ width: `${(result.west / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="cycle-time">
                  <div className="cycle-time-badge">
                    Total Cycle Time: <span className="cycle-time-value">
                      {result.north + result.south + result.east + result.west} seconds
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="print-button-container">
              <button 
                onClick={() => window.print()} 
                className="print-button"
              >
                Print Results
              </button>
            </div>
          </div>
        )}
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3 className="footer-logo-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                AI Traffic Optimizer
              </h3>
              <p className="footer-tagline">Smart solutions for urban mobility</p>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} AI Traffic Systems • All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;