import { useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CandidateDetails from "./pages/CandidateDetails";

function App() {
  const [view, setView] = useState("signup");
  const [candidateProfile, setCandidateProfile] = useState(null);

  if (view === "login") {
    return <Login onSwitchView={setView} />;
  }

  if (view === "candidate-details") {
    return (
      <CandidateDetails
        registrationData={candidateProfile}
        onBackToSignup={() => setView("signup")}
      />
    );
  }

  return (
    <Signup
      onSwitchView={setView}
      onRegistered={(data) => {
        setCandidateProfile(data);
        setView("candidate-details");
      }}
    />
  );
}

export default App;
