import React, { useState } from 'react';
import './App.css';

function App() {
  // state ควบคุมหน้าจอ: 'initial', 'ready', 'loading', 'results'
  const [appState, setAppState] = useState('initial');
  
  // เพิ่ม State สำหรับเก็บไฟล์และผลลัพธ์จาก API
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  // ฟังก์ชันจัดการเมื่อผู้ใช้อัปโหลดไฟล์
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    if (files.length > 0) {
      setAppState('ready');
    } else {
      setAppState('initial');
    }
  };

  // ฟังก์ชันสำหรับส่งไฟล์ไปหา Backend
  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) return;

    setAppState('loading'); // เปลี่ยนหน้าจอเป็นกำลังโหลด

    const formData = new FormData();
    // นำไฟล์ทั้งหมดใส่เข้าไปใน formData โดยใช้ชื่อ key ว่า "files" (ต้องตรงกับฝั่ง FastAPI)
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // ยิง API ไปที่เซิร์ฟเวอร์ FastAPI (ปกติรันที่พอร์ต 8000)
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAnalysisResult(data); // เก็บผลลัพธ์ไว้ใน State
      setAppState('results');  // เปลี่ยนหน้าจอไปแสดงผลลัพธ์

    } catch (error) {
      console.error("Error analyzing images:", error);
      alert("เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ");
      setAppState('ready'); // กลับไปหน้าพร้อมวิเคราะห์ถ้า error
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        {appState === 'results' ? (
          <div className="header-lฤeft">
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
            <div className="upload-view">
              <p className="label">Upload Images</p>
              
              <div className="dropzone">
                {/* เพิ่ม input สำหรับเลือกไฟล์ */}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginBottom: '10px' }}
                />
                
                {appState === 'initial' ? (
                  <>
                    <p>Supports up to 300 images</p>
                    <p className="file-count">{selectedFiles.length} file selected</p>
                  </>
                ) : (
                  <p className="file-count">{selectedFiles.length} files selected</p>
                )}
              </div>

              <div className="btn-group">
                <button className="btn-outline" onClick={() => {
                  setSelectedFiles([]);
                  setAppState('initial');
                }}>
                  Clear
                </button>
                {/* ผูกปุ่ม Start Analysis กับฟังก์ชันที่เราสร้างไว้ */}
                <button 
                  className="btn-primary" 
                  onClick={handleAnalyze}
                  disabled={appState === 'loading' || selectedFiles.length === 0}
                >
                  {appState === 'loading' ? 'Analyzing...' : 'Start Analysis'}
                </button>
              </div>
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