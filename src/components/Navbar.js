import React, { Children, createContext, useState } from "react";
import "../NavbarStyles.css";
import Logo from "../watchdog-logo.svg";
import networkList from "../networkList.json";
import { Popover, Radio } from "antd";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChainIdState } from "../contexts/ChainIdContext";

const Navbar = (props) => {
  const { address, isConnected, connect, ensName, } = props;
  const [isStateTrue, setIsStateTrue] = useState(false);
  const [network, setNetwork] = useState(networkList[0].name);
  const [networkImage, setNetworkImage] = useState(networkList[0].img);
  // const [chainId, setChainId] = useState(networkList[0].chainId);

  const {setChainId} = ChainIdState(1);

  function handleNetworkChange(e) {
    const selectedNetwork = e.target.value;

    setNetwork(selectedNetwork);

    // Find the network object in the networkList array based on the selected network
    const selectedNetworkObj = networkList.find(
      (network) => network.name === selectedNetwork
    );

    if (selectedNetworkObj) {
      // Set the network image based on the selected network object's img property
      setNetworkImage(selectedNetworkObj.img);
      setChainId(selectedNetworkObj.chainId);
      console.log(selectedNetworkObj.chainId);
      
    }
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
              <div className="connectButton" onClick={connect}>
                {isConnected
                  ? ensName ?? address.slice(0, 4) + "..." + address.slice(38)
                  : "Connect"}
              </div>
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
