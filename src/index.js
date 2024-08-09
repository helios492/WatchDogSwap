import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//import { base } from "../src/components/Chain";
import { BrowserRouter } from "react-router-dom";
// import { configureChains, WagmiConfig, createClient} from "wagmi";
// import { bsc, mainnet } from 'wagmi/chains'
// import { publicProvider } from "wagmi/providers/public";
import ChainIdProvider from "./contexts/ChainIdContext";
import WagmiQueryProvider from "./contexts/WagmiContext";

// const { provider, webSocketProvider } = configureChains(
//   [mainnet, bsc],
//   [publicProvider()]
// );

// const client = createClient({
//   autoConnect: true,
//   provider,
//   webSocketProvider,
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChainIdProvider>
      <WagmiQueryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WagmiQueryProvider>
    </ChainIdProvider>
  </React.StrictMode>
);
