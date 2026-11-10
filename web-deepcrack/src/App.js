import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [predUrl, setPredUrl] = useState();
  const [srcUrl, setSrcUrl] = useState();
  const [side1Url, setSide1Url] = useState();
  const [side2Url, setSide2Url] = useState();
  const [side3Url, setSide3Url] = useState();
  const [side4Url, setSide4Url] = useState();
  const [side5Url, setSide5Url] = useState();
  const [fusedUrl, setFusedUrl] = useState();
  const [width, setImgWidth] = useState(1);
  const [height, setImgHeight] = useState(1);
  const [unit, setImgUnit] = useState('m');
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      if (event.target.files && event.target.files[0]) {
        setSrcUrl(
          URL.createObjectURL(event.target.files[0])
        );
}
  };
  const setWidth = (event) => {
    setImgWidth(event.target.value)
  }
  const setUnit = (event) => {
    setImgUnit(event.target.value)
  }
  const setHeight = (event) => {
    setImgHeight(event.target.value)
  }
  const resetResults = () => {
    setPredUrl(undefined);
    setFusedUrl(undefined);
    setSide1Url(undefined);
    setSide2Url(undefined);
    setSide3Url(undefined);
    setSide4Url(undefined);
    setSide5Url(undefined);
    setSummary(null);
  };
  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    formData.append('width', width || 1);
    formData.append('height', height || 1);
    formData.append('unit', unit || 'm');

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let detail = '';
        try {
          const body = await response.json();
          detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail || '');
        } catch (_) {
          // non-JSON error body
        }
        throw new Error(`Server error ${response.status}${detail ? ': ' + detail : ''}`);
      }
      const data = await response.json();
      // images.* are already complete data URLs
      const images = data.images || {};
      setPredUrl(images.result);
      setFusedUrl(images.fused);
      setSide1Url(images.side1);
      setSide2Url(images.side2);
      setSide3Url(images.side3);
      setSide4Url(images.side4);
      setSide5Url(images.side5);
      setSummary({
        status: data.analysis && data.analysis.status,
        coverage: data.crack_coverage_percent,
      });
    } catch (err) {
      console.error(err);
      resetResults();
      setError(err.message || 'Analysis failed');
    }
  }
  return (  <div className="d-flex">
      <div className="card mx-5">
        <div className="mx-auto mt-5">
          <Form onSubmit={handleSubmit}>
            <input name="image" type="file" onChange={changeHandler} accept=".jpeg, .png, .jpg"/>
            <Form.Group className="mb-3">
            <Form.Label>Real width</Form.Label>
            <Form.Control type="text" placeholder="some number"  onChange={setWidth}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Real height</Form.Label>
            <Form.Control type="text" placeholder="some number" onChange={setHeight}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Measurement unit</Form.Label>
            <Form.Control type="text" placeholder="some unit" onChange={setUnit}/>
          </Form.Group>
            <Button variant="primary" type="submit">Predict</Button>
          </Form>
          {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
          {summary && (
            <div className="alert alert-info mt-3">
              {summary.status} ({summary.coverage}% coverage)
            </div>
          )}
        </div>
      </div>
      <div className="card">
        <div className="d-flex mx-auto">
          <h1 className="mt-2">Crack Detection using DeepCrack</h1>
        </div>
        <div className="d-flex mx-auto">
          <div className="image-container m-4">
            <img src={srcUrl} width="512" height="512" alt="" />
            <h3>Selected Image</h3>
          </div>
          <div className="image-container m-4">
            <img src={predUrl} width="512" height="512" alt="" />
            <h3>Prediction Visualization</h3>
          </div>
        </div>
        <div className="d-flex mx-auto">
          <h3 className="mt-2">Intermediate Predictions:</h3>
        </div>
        <div className="d-flex mx-auto">

          <div className="image-container m-3">
            <img src={side1Url} width="256" height="256" alt="" />
            <h3>Side 1 Prediction</h3>
          </div>
          <div className="image-container m-3">
            <img src={side2Url} width="256" height="256" alt="" />
            <h3>Side 2 Prediction</h3>
          </div>
          <div className="image-container m-3">
            <img src={side3Url} width="256" height="256" alt="" />
            <h3>Side 3 Prediction</h3>
          </div>
          <div className="image-container m-3">
            <img src={side4Url} width="256" height="256" alt="" />
            <h3>Side 4 Prediction</h3>
          </div>
          <div className="image-container m-3">
            <img src={side5Url} width="256" height="256" alt="" />
            <h3>Side 5 Prediction</h3>
          </div>
        </div>
        <div className="d-flex mx-auto">
          <h3 className="mt-2">Fused Prediction:</h3>
        </div>
        <div className="mx-auto">
        <div className="image-container m-3">
          <img src={fusedUrl} width="256" height="256" alt="" />
        </div>
        </div>
      </div>
  </div>
);
}

export default App;
