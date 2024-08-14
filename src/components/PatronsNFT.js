import React, { useState } from 'react';
import Web3 from 'web3';
import NFT from "../watchdogNFT.png";
import VAULT from "../vault.png";
//import {network} from "./Navbar";
import { Popover } from "antd";
import { InfoCircleOutlined, AimOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PatronsNFT = () => {

  const [isTransactionPending, setTransactionPending] = useState(false);

  function openPopupWidget(url) {
    const width = 600; // Set the desired width of the popup
    const height = 400; // Set the desired height of the popup
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
  
    // Define the settings for the popup window
    const popupSettings = `
      width=${width},
      height=${height},
      top=${top},
      left=${left},
      resizable=yes,
      scrollbars=yes
    `;
  
    window.open(url, 'PopupWindow', popupSettings);
  }
  

  const settings = (
    <>
      <div className="vaultPop">
        <ul>
          <li>You must hold at least 1 <b>Patron NFT</b> in order to claim.</li>
          <li>You can <b>ONLY</b> claim once every 7 days.</li>
          <li>All payments are paid in <b>WETH</b>.</li>
          <li>1 <b>Patron NFT</b> = <b>0.01%</b> claim amount percentage from the <b>Vault</b>.</li>
          <li>The more <b>Patron NFTs</b> you hold the higher your claim amount percentage.</li>
        </ul>
      </div>
    </>
  );

  const patronsOnly = (
    <>
      <div className="popNFT">
          <div>
              <h3 className="popHead">WatchDog Patrons NFT DETAILS</h3>
                <div>
                    <p>
                    The <b>WatchDog Patrons NFT</b> is a redeemable certificate issued by the <b>WatchDog Protocol.</b>
                    </p>
                    <p>
                    This note is used as a means to redeem <b>WETH (or its equivalent wrapped verison of the native token)</b> 
                    <br/>on the chain where the <b>WatchDog Secure Swap Contract</b> is deployed.
                    </p>
                    <p>
                      Funds generated from the sale of these notes is used as liquidity for the <b>WatchDog Token $WDOG</b>.
                    </p>
                    <p>
                      Each NFT is sold for <b>0.101 Ether</b> with <b>0.1 Ether</b> going to liquidity and <b>0.001 Ether</b> for protocol
                      <br/> maintenance respectively.
                    </p>
                    <p>
                      Minting is done on <b>Opensea</b> and thus allows the <b>WatchDog Patrons NFT</b> to be further tradable.
                    </p>
                </div>
          </div>
          <div>
                <h3 className="popHead">DISCLAIMER</h3>
                <div>
                    <p>
                    The issuance and sale of the <b>WatchDog Patrons NFT</b> is not a solicitation for purchase to any investor.
                    </p>
                    <p>
                      We urge you to do your own research to validate our service offerings and make your own informed decisions
                      <br/> regarding purchase of the <b>WatchDog Patrons NFT</b>.
                    </p>
                </div>
          </div>
          <div>
          <h4>Read our <a href= "http://abhayfootball.000webhostapp.com/">Whitepaper</a> </h4>
          </div>
      </div>
    </>
  );
return (
    <div>
      <section className="desc">
      <div className="dogPatrons">
      <h2 className="nftDetails">Patrons NFT</h2>
      <p className="nftDesc">
        <div>
        The <b>WatchDog Patrons NFT</b> is an ERC721 standard
        Certified Patrons NFT issued as a tokenized Note
        to a group of holders called <b>The WatchDog Certified Patrons.</b>
        <br/>
        <br/>
        There will only be <b>10,000</b> of this Note ever minted.
        <br/>
        <br/>
        This Note allows holders claim <b>WETH (or its equivalent 
        wrapped verison of the native token)</b> on the chain where the 
        <b>WatchDog Secure Swap Contract</b> is deployed.
        <br/>
        <br/>
        The <b>WETH</b> paid to the holders is generated from the <b>WatchDog Secure Swap Contract.</b>
        <br/>
        <br/>
        Each holder is eligible to claim <b>0.01%</b> of the treasury holdings
        of the <b><a href= "https://etherscan.io/">WatchDog Vault.</a></b>
        <br/>
        <br/>
        The more NFTs held by a holder the higher the claim amount.
        <br/>
        <br/>
        Claims are done every <b>7 days</b> from the <b>WatchDog Vault Contract.</b>
        <br/>
        <br/>
        More about <b>WatchDog Patrons NFT</b> here <ArrowRightOutlined/> <Popover
          className="popCan"
          content={patronsOnly}
          title=" "
          trigger="hover"
          placement="topLeft"
        >
        <AimOutlined className="cog"/>
        </Popover>
      </div>
      </p>
      </div>
      <div>
        <div>
              <img src={NFT} alt="logo" className="nft" />
              </div>
              <div>
              <button
                      className="swapButton"
                      onClick={() => openPopupWidget('https://opensea.io/collection/the-beta-bots/')}
                    >
                      Mint
              </button>
              </div>
              <div>
              <div title="Buy on OpenSea" onClick={() => window.open('https://opensea.io/collection/the-beta-bots/', '_blank')}><img src="https://storage.googleapis.com/opensea-static/Logomark/Badge%20-%20Available%20On%20-%20Dark.png" alt="Available on OpenSea" /></div>
              </div>
        </div>
      </section>

   <section className="desc">
      <div className="dogPatronsTwo">
      <h2 className="nftDetails">WatchDog Vault</h2>
      <div className="tradeBoxVault">
                <div className="tradeBoxHeader">
                    <h4 className="vaultHead">WatchDog Vault</h4>
                    <Popover
                      content={settings}
                      title="Vault Details"
                      trigger="hover"
                      placement="bottomLeft"
                    
                    >
                        <InfoCircleOutlined className="cog"/>
                    </Popover>
</div>
                <span>Patron NFTs held: 1 </span>
                <br/>
                <span>Claim percentage: 10% </span>
                <br/>
                <span>Vault Treasury holdings: 100 ETH</span>
                <br/>
                <div className="patronButton">
                  <button className="swapButton">Claim Patron Royalty</button>
                </div>
            </div>
      </div>
      <div>
      <div>
              <img src={VAULT} alt="logo" className="vault" />
              </div>
    </div>
    </section>
    <br/>
    <br/>
  </div>
  )
} 

export default PatronsNFT