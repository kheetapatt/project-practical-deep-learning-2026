import React, { useState } from 'react';
import './App.css';

function App() {
  // state: 'initial' (ภาพ 2), 'ready' (ภาพ 3), 'results' (ภาพ 4)
  const [appState, setAppState] = useState('initial');

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        {appState === 'results' ? (
          <div className="header-left">
            <button className="btn-back" onClick={() => setAppState('ready')}>
              &larr; Go back
            </button>
            <h1>Medical Slide Analysis System</h1>
          </div>
        ) : (
          <h1>Medical Slide Analysis System</h1>
        )}
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* === Left Panel === */}
        <aside className="left-panel">
          {appState !== 'results' ? (
            // --- View: Upload / Ready ---
            <div className="upload-view">
              <p className="label">Upload Images</p>
              
              <div className="dropzone">
                {appState === 'initial' ? (
                  <>
                    <p>Supports up to 300 images</p>
                    <p className="file-count">0 file selected</p>
                  </>
                ) : (
                  <p className="file-count">200 file selected</p>
                )}
              </div>

              <div className="btn-group">
                <button className="btn-outline" onClick={() => setAppState('ready')}>Upload Images</button>
                <button className="btn-outline" onClick={() => setAppState('initial')}>Clear/Reset</button>
              </div>

              <button className="btn-outline full-width">Review the previous analysis results.</button>

              {appState === 'ready' && (
                <div className="analyze-section">
                  <div className="input-row">
                    <label>Slide ID:</label>
                    <input type="text" disabled className="input-box" />
                    <button className="btn-primary" onClick={() => setAppState('results')}>Analyze</button>
                  </div>
                  <div className="info-box gray">
                    <strong>Files Ready for Analysis</strong>
                    <p>200 images uploaded and ready. Click "Analyze" to begin automated screening.</p>
                  </div>
                </div>
              )}

              {appState === 'initial' && (
                <div className="info-box blue">
                  <strong>Recommendation:</strong>
                  <p>Capture images at Field of View 0.5 mm for optimal analysis accuracy. Ensure consistent lighting and focus across all slides.</p>
                </div>
              )}
            </div>
          ) : (
            // --- View: Results Overview ---
            <div className="results-overview">
              <h3>Slide overview</h3>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Total Cells</span>
                  <span className="stat-value">50,000</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Suspicious Cells</span>
                  <span className="stat-value">200</span>
                </div>
                <div className="stat-box full-width">
                  <span className="stat-label">Images showing suspicious cells</span>
                  <span className="stat-value">40</span>
                </div>
              </div>

              <h4 className="list-title">Top Images showing suspicious cells:</h4>
              <p className="list-subtitle">(showing top 30)</p>
              
              <div className="image-list">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div key={idx} className={`list-item ${idx === 0 ? 'active' : ''}`}>
                    <div>
                      <strong>Image #5</strong>
                      <div className="text-orange">15 Abnormal Cells</div>
                    </div>
                    <span className="arrow">&gt;</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* === Right Panel === */}
        <section className="right-panel">
          {appState === 'results' ? (
            <div className="image-detail-view">
              <h2>Image #5</h2>
              <p className="text-gray">15 abnormal cells detected</p>
              
              <div className="main-image-placeholder">
                <div className="bounding-box" style={{top: '45%', left: '50%'}}>1</div>
                <div className="bounding-box" style={{top: '48%', left: '46%'}}>2</div>
                <p>Mockup Main Image</p>
              </div>

              <div className="cell-crops">
                <div className="crop-box">
                  <strong>Cell #1</strong>
                  <p className="text-gray text-small">86% Confidence</p>
                  <div className="crop-img-placeholder"></div>
                </div>
                <div className="crop-box">
                  <strong>Cell #2</strong>
                  <p className="text-gray text-small">86% Confidence</p>
                  <div className="crop-img-placeholder"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              {/* ปล่อยว่างไว้ตามดีไซน์รูป 2 และ 3 */}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="disclaimer">
          This system is intended as decision support for qualified pathologists only. All results must be verified by a licensed medical professional. Not for diagnostic use without clinical correlation.
        </div>
      </footer>
    </div>
  );
}

export default App;