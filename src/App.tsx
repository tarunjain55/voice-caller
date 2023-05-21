import { useState } from "react";
import "./App.css";
import Phone from "./phone";
import { getToken } from "./services/rest";

const App = () => {
  const [token, setToken] = useState("");

  const init = async () => {
    const token = (await getToken()).data.token;
    setToken(token);
  };

  return (
    <div className="app">
      <div className="header">55 Voice Caller </div>
      {token ? (
        <div className="phone-box">
          <Phone token={token} />
        </div>
      ) : (
        <div className="connect-button button" onClick={() => init()}>
          Connect
        </div>
      )}
    </div>
  );
};

export default App;
