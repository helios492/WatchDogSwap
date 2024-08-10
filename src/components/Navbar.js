import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import "../NavbarStyles.css";
import Logo from "../watchdog-logo.svg";
import networkList from "../networkList.json";
import { Modal, Popover, Radio } from "antd";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChainIdState } from "../contexts/ChainIdContext";
import { watchChainId } from "@wagmi/core";
import { injected } from "@wagmi/connectors";
import { config } from "../config";
import {
  Connector,
  useConnect,
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSwitchChain,
} from "wagmi";

const Navbar = (props) => {
  const { address, isConnected, connect, ensName, connectors } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isStateTrue, setIsStateTrue] = useState(false);
  const [network, setNetwork] = useState(networkList[0].name);
  const [networkImage, setNetworkImage] = useState(networkList[0].img);
  const { chainId, setChainId } = ChainIdState(1);
  const { switchChain, isLoading, error } = useSwitchChain();

  function WalletOptions() {
    const { connectors, connect } = useConnect();
    const connectWallet = (connector) => {
      connect(connector);
      setIsOpen(false);
    };

    return (
      <div className="walletConnect">
        <button className="connectButton" onClick={() => setIsOpen(true)}>
          Connect
        </button>
        <Modal
          open={isOpen}
          footer={null}
          onCancel={() => setIsOpen(false)}
          title="Connect Wallet"
          className="walletModal"
        >
          <div className="modalContent">
            {connectors.map((connector) => (
              <li
                key={connector.uid}
                onClick={() => connectWallet({ connector })}
              >
                <div className="tokenChoice">{connector.name}</div>
              </li>
            ))}
          </div>
        </Modal>
      </div>
    );
  }

  function Account() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName });

    return (
      <div>
        <div className="connectButton" onClick={() => disconnect()}>
          {isConnected
            ? ensName ?? address?.slice(0, 4) + "..." + address?.slice(38)
            : "Connect"}
        </div>
        {/* {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
        {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
        <button onClick={() => disconnect()}>Disconnect</button> */}
      </div>
    );
  }

  useEffect(() => {
    console.log(chainId);
  }, [chainId]);

  const handleNetworkChange = (e) => {
    const selectedNetwork = e.target.value;

    // Find the network object in the networkList array based on the selected network
    const selectedNetworkObj = networkList.find(
      (network) => network.name === selectedNetwork
    );

    if (selectedNetworkObj) {
      // Set the network image based on the selected network object's img property
      switchChain({ chainId: selectedNetworkObj.chainId });
      setNetworkImage(selectedNetworkObj.img);
      setChainId(selectedNetworkObj.chainId);
      setNetwork(selectedNetwork);
    }
  }

  function ConnectWallet() {
    const { isConnected } = useAccount();
    if (isConnected) return <Account />;
    return <WalletOptions />;
  }

  const networks = (
    <>
      <div>Select Network</div>
      <div>
        <Radio.Group value={network} onChange={handleNetworkChange}>
          <Radio.Button value={networkList[0].name}>Ethereum</Radio.Button>
          <Radio.Button value={networkList[1].name}>Binance</Radio.Button>
          <Radio.Button value={networkList[2].name}>Base</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  const handleButtonClick = () => {
    setIsStateTrue((prevState) => !prevState);
  };

  return (
    <div>
      <nav>
        <Link to="/" className="link">
          <img src={Logo} alt="logo" className="logo" />
        </Link>
        <div>
          <ul
            id="navbar"
            className={isStateTrue ? "#navbar active" : "#navbar"}
          >
            <li>
              <Link to="/swap" className="link">
                <div className="headerItem">Swap</div>
              </Link>
            </li>
            <li>
              <Link to="/patronsNFT" className="link">
                <div className="headerItem">WatchDog Patrons</div>
              </Link>
            </li>
            <li>
              <Link to="/stake" className="link">
                <div className="headerItem">Staking</div>
              </Link>
            </li>
            <li>
              <Link to="/pool" className="link">
                <div className="headerItem">Pool</div>
              </Link>
            </li>
            <li>
              <div className="headerItem">
                <Popover
                  content={networks}
                  title="Networks"
                  trigger="click"
                  placement="bottomRight"
                  className="showNetwork"
                >
                  <img src={networkImage} alt="img" className="network" />
                  {network}
                </Popover>
              </div>
            </li>
            <li>
              <ConnectWallet />
            </li>
          </ul>
        </div>
        <div id="mobile" onClick={handleButtonClick}>
          {isStateTrue ? <FaTimes id="icon" /> : <FaBars id="icon" />}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
