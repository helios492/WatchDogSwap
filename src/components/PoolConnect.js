import React from 'react'
import WALLET from "../wallet.png";

const PoolConnect = () => {

  function handleChange() {

      alert("Please Connect Your Wallet");
  }

  return (
    <div className="PoolConnect">
        <div className="PoolConnectBox">
              <div className="PoolConnectBoxHeader">
                    <h2>Pools</h2>
                    <p onClick={handleChange}>+ New Position</p>
              </div>
              <div className="PoolConnectBoxMiddle">
                    <img src={WALLET} alt="wallet" width={80} height={80}/>
                    <p>Your active liquidity positions will appear here.</p>
                    <button>Connect Wallet</button>
              </div>
              <div className="PoolConnectBoxInfo">
                    <div className="PoolConnectBoxInfoLeft">
                          <h4><b>Learn about providing liquidity.</b></h4>
                          <p>Check out our LP walkthrough guide.</p>
                    </div>
                    <div className="PoolConnectBoxInfoRight">
                          <h4><b>Top pools.</b></h4>
                          <p>Explore WatchDog Analytics.</p>
                    </div>
              </div>
        </div>
    </div>
  )
}

export default PoolConnect