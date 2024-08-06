import React, {useState, useEffect} from 'react'
import ETH from "../eth.svg";
import WALLET from "../wallet.png";
import TICK from "../tick.png";
import { CloseOutlined, ArrowLeftOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Token from './Token';
import SearchToken from './SearchToken';


const PoolAdd = () => {

  const [openModal, setOpenModal] = useState(false);
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [active, setActive] = useState(1);
  const [openFee, setOpenFee] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const feePair = [
    {
        fee:"0.05%",
        info:"Best for stable pairs.",
        number:"0% select",
    },
    {
        fee:"0.3%",
        info:"Best for most pairs.",
        number:"0% select",
    },
    {
        fee:"1%",
        info:"Best for exotic pairs",
        number:"0% select",
    },
  ];


  const minPriceRange = (text) => {
        if (text == "+") {
          setMinPrice(minPrice + 1);
        } else if (text == "-") {
          setMinPrice(minPrice - 1);
        }
  };

  const maxPriceRange = (text) => {
    if (text == "+"){
      setMaxPrice(maxPrice + 1);
    } else if (text == "-"){
      setMaxPrice(maxPrice - 1);
    }
  };

  function switchScreen(){

  }


  return (
    <div className="poolAdd">
          <div className="poolAddBox">
                <div className="poolAddBoxHeader">
                      <div className="poolAddBoxHeaderLeft" onClick={() => switchScreen()}>
                          <ArrowLeftOutlined width={30} height={30}/>
                      </div>
                      <div className="poolAddBoxHeaderMiddle">
                          <p>Add Liquidity</p>
                      </div>
                      <div className="poolAddBoxHeaderRight">
                          <p>Clear All</p>
                          <CloseOutlined width={50} height={50} onClick={() => setOpenModal(true)}/>
                      </div>
                </div>
                <div className="poolAddBoxPrice">
                      <div className="poolAddBoxPriceLeft">
                          <h4>Select Pair</h4>
                          <div className="poolAddBoxPriceLeftToken">
                                <div className="poolAddBoxPiceLeftTokenInfo">
                                    <p>
                                        <img src={ETH} alt="eth" width={20} height={20}/>
                                    </p>
                                    <p>WDOG</p>
                                    <p><ArrowDownOutlined/></p>
                                </div>
                                <div className="poolAddBoxPiceLeftTokenInfo" onClick={() => setOpenTokenModal(true)}>
                                    <p>
                                        <img src={ETH} alt="eth" width={20} height={20}/>
                                    </p>
                                    <p>WETH</p>
                                    <p><ArrowDownOutlined/></p>
                                </div>
                          </div>
                          <div className="poolAddBoxPriceLeftFee">
                                <div className="poolAddBoxPriceLeftFeeLeft">
                                      <h4>Fee Tier</h4>
                                      <p>The <b>%</b> you will earn in fees.</p>
                                </div>
                                {openFee ? (
                                  <button onClick={() => setOpenFee(false)}>Hide</button>
                                ) : (
                                  <button onClick={() => setOpenFee(true)}>Show</button>
                                )}
                          </div>
                              {openFee && (
                                <div className="poolAddBoxPriceLeftList">
                                      {feePair.map((el,i) => (
                                          <div className="poolAddBoxPriceLeftListItem" key={i+1} onClick={() => setActive(i+1)}>
                                                <div className="poolAddBoxPriceLeftListItem">
                                                      <p>{el.fee}</p>
                                                      <p>
                                                        {active == i + 1 ? (
                                                          // correct this imgae variable
                                                          <img src={TICK} alt="ticker" width={20} height={20}/>
                                                        ) : ("")}
                                                      </p>
                                                </div>
                                                <small>{el.info}</small>
                                                <p className="poolAddBoxPriceLeftListItemPair">
                                                  {el.number}
                                                </p>
                                          </div>                                       
                                      ))}
                                </div>
                            )}
                            <div className="poolAddBoxDeposit">
                                  <h4>Deposit Amount</h4>
                                  <div className="poolAddBoxDepositBox">
                                        <input type="text" placeholder="0"/>
                                        <div className="poolAddBoxDepositBoxInput">
                                              <p>
                                                  <small>WDOG</small>WatchDog
                                              </p>
                                              <p className="poolAddBoxDepositBoxInputItem">
                                                  Balance: 0.00
                                              </p>
                                        </div>
                                  </div>
                                  <div className="poolAddBoxDepositBox">
                                        <input type="text" placeholder="0"/>
                                        <div className="poolAddBoxDepositBoxInput">
                                              <p>
                                                  <small>ETH</small>Ether
                                              </p>
                                              <p className="poolAddBoxDepositBoxInputItem">
                                                  Balance: 0.00
                                              </p>
                                        </div>
                                  </div>
                            </div>
                      </div>
                      <div className="poolAddBoxPriceRight">
                            <h4>Set Price Range</h4>
                            <div className="poolAddBoxPriceRightBox">
                                  <p className="poolAddBoxPriceRightBoxPair">
                                      Current Price: 41.487 Testv4 per WETH
                                  </p>
                                   <img src={WALLET} alt="wallet" width={80} height={80}/>
                                  <h3>Your position will appear here</h3>
                            </div>
                            <div className="poolAddBoxPriceRightRange">
                                  <div className="poolAddBoxPriceRightRangeBox">
                                        <p>Min Price</p>
                                        <p
                                         className="poolAddBoxPriceRightRangeBoxPair"
                                         onClick={(e) => minPriceRange(e.target.innerText)}
                                        >
                                          <small>-</small> {minPrice} <small>+</small>
                                        </p>
                                        <p>Testv4 per WETH</p>
                                  </div>
                                  <div className="poolAddBoxPriceRightRangeBox">
                                        <p>Max Price</p>
                                        <p
                                         className="poolAddBoxPriceRightRangeBoxPair"
                                         onClick={(e) => maxPriceRange(e.target.innerText)}
                                        >
                                          <small>-</small> {maxPrice} <small>+</small>
                                        </p>
                                        <p>Testv4 per WETH</p>
                                  </div>
                            </div>
                            <div className="poolAddBoxPriceRightButton">
                                  <button>Full Range</button>
                            </div>
                            <div className="poolAddBoxPriceRightAmount">
                                  <button>Enter an amount</button>
                            </div>
                      </div>
                </div>
          </div>
          {openModal && (
                <div className="token">
                  <Token setOpenSetting={setOpenModal} />
                </div>
          )}
          {openTokenModal && (
                <div className="token">
                <SearchToken tokenData="hey" openToken={setOpenTokenModal} />
              </div>
          )}
    </div>
  );
};

export default PoolAdd