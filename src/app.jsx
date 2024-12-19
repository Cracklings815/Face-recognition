import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FingerprintScanner from "./Fsite";
import Register from "./Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FingerprintScanner />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
