import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FingerprintScanner from "./Fsite";
import Register from "./Register";
import Main from "./main_profiling";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FingerprintScanner />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
