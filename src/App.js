import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Swap from "./components/Swap";
import PatronsNFT from "./components/PatronsNFT";
import Pool from "./components/Pool";
import Stake from "./components/Stake";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
// import { InjectedConnector } from "wagmi/connectors/injected";

function App() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();
  

  return (
        <div className="App">
          <Navbar
            connectors={connectors}
            connect={connect}
            isConnected={isConnected}
            address={address}
            disconnect={disconnect}
            ensName={ensName}
          />
          <div className="mainWindow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/swap"
                element={<Swap isConnected={isConnected} address={address} />}
              />
              <Route
                path="/patronsNFT"
                element={
                  <PatronsNFT isConnected={isConnected} address={address} />
                }
              />
              <Route
                path="/pool"
                element={<Pool isConnected={isConnected} address={address} />}
              />
              <Route
                path="/stake"
                element={<Stake isConnected={isConnected} address={address} />}
              />
            </Routes>
          </div>
        </div>
  );
}

export default App;
