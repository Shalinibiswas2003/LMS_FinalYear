import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import ResultDisplay from "../../Components/ResultDisplay/ResultDisplay";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total } = location.state || {};

  if (score === undefined || total === undefined) {
    // Redirect if no state is passed
    navigate("/");
    return null;
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "10rem", textAlign: "center", color: "#fff" }}>
        <ResultDisplay score={score} total={total} />
      </div>
    </>
  );
};

export default ResultPage;
