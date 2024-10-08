import React, { useState, useEffect } from "react";
import ETH from "../eth.svg";
import WALLET from "../wallet.png";
import TICK from "../tick.png";
import {
  CloseOutlined,
  ArrowLeftOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { ChainIdState } from "../contexts/ChainIdContext";
import axios from "axios";
import { useAccount, useSignMessage } from "wagmi";
import { getAccount } from "wagmi/actions";
import { config } from "../config";
import { ethers } from "ethers";
import IUniswapV2Router02 from "../abis/IUniswapV2Router02.json";
import Web3 from "web3";
import { TOKEN_ABI } from "../contracts";
import tokens from "../tokenList.json";
import Moralis from "moralis";

const PoolAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [filteredTokenList, setFilteredTokenList] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [tokenOne, setTokenOne] = useState();
  const [tokenTwo, setTokenTwo] = useState();
  const [tokenOneVal, setTokenOneVal] = useState(0);
  const [tokenTwoVal, setTokenTwoVal] = useState(0);
  const [rangeFlag, setRangeFlag] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);
  const [tokenTwoDecimals, setTokenTwoDecimals] = useState(null);
  const { address, isConnected } = useAccount();
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [fToken, setFToken] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [active, setActive] = useState(1);
  const [openFee, setOpenFee] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changeToken, setChangeToken] = useState(1);
  const { netChainId } = ChainIdState();
  const { account } = getAccount(config);
  const [walletInstalled, setWalletInstalled] = useState(false);

  const t = localStorage.getItem("token");
  const localToken = t ? JSON.parse(t) : [];


  useEffect(() => {
    if(provider) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum))
      setSigner(new ethers.VoidSigner(address, provider))
    }
  }, [provider, address]);


  const feePair = [
    {
      fee: "0.05%",
      info: "Best for stable pairs.",
      number: "0% select",
    },
    {
      fee: "0.3%",
      info: "Best for most pairs.",
      number: "0% select",
    },
    {
      fee: "1%",
      info: "Best for exotic pairs",
      number: "0% select",
    },
  ];

  useEffect(() => {
    const checkTokenDecimals = async () => {
      if (isConnected) {
        // Create a Web3 instance using the current provider
        const web3 = new Web3(window.ethereum);

        // Create a contract instance
        const tokenContract = new web3.eth.Contract(
          TOKEN_ABI,
          tokenOne?.address
        );
        const tokenTwoContract = new web3.eth.Contract(
          TOKEN_ABI,
          tokenTwo?.address
        );

        // Check Token decimlas for contract
        let decimals = await tokenContract.methods.decimals().call();
        let decimalsTwo = await tokenTwoContract.methods.decimals().call();

        // Convert BigInt to regular number
        decimals = Number(decimals);
        decimalsTwo = Number(decimalsTwo);

        setTokenDecimals(decimals);
        setTokenTwoDecimals(decimalsTwo);
        console.log(`Decimals var1:${tokenDecimals}`);
        console.log(`Decimals var2:${tokenTwoDecimals}`);
        console.log(`Token1 Decimals:${decimals}`);
        console.log(`Token2 Decimals:${decimalsTwo}`);
      }
    };

    checkTokenDecimals();
  }, [tokenOne?.address, TOKEN_ABI]);

  useEffect(() => {
    const checkTokenBalance = async () => {
      if (isConnected) {
        // Create a Web3 instance using the current provider
        const web3 = new Web3(window.ethereum);

        //Write logic to check ETH balance

        // Create a contract instance
        const tokenContract = new web3.eth.Contract(
          TOKEN_ABI,
          tokenOne?.address
        );
        const tokenTwoContract = new web3.eth.Contract(
          TOKEN_ABI,
          tokenTwo?.address
        );

        // Check Token balance for contract
        let balance = await tokenContract.methods.balanceOf(address).call();
        let balanceTwo = await tokenTwoContract.methods
          .balanceOf(address)
          .call();

        if (tokenDecimals == null) {
          // Check Token decimals for contract
          let decimals = await tokenContract.methods.decimals().call();

          // Convert BigInt to regular number
          decimals = Number(decimals);

          setTokenDecimals(decimals);
        }

        if (tokenTwoDecimals == null) {
          // Check Token decimals for contract
          let decimals = await tokenTwoContract.methods.decimals().call();

          // Convert BigInt to regular number
          decimals = Number(decimals);

          setTokenTwoDecimals(decimals);
        }

        // Convert BigInt to regular number
        balance = Number(balance);
        balanceTwo = Number(balanceTwo);

        // Adjust the balance based on token decimals
        const adjustedBalance = balance / 10 ** tokenDecimals;
        const adjustedBalanceTwo = balanceTwo / 10 ** tokenTwoDecimals;

        setWalletBalance(adjustedBalance);
        setTokenTwoBalance(adjustedBalanceTwo);

        console.log(`Wallet Token balance: ${walletBalance}`);
        console.log(`Wallet Token balance: ${tokenTwoBalance}`);
        console.log(`Token1 balance: ${adjustedBalance}`);
        console.log(`Token2 balance: ${adjustedBalanceTwo}`);
      }
    };

    checkTokenBalance();
  }, [window.ethereum, tokenOne?.address, TOKEN_ABI]);

  const UNISWAP_V2_ROUTER_ADDRESS =
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Mainnet router address

  function getRouterContract(signer) {
    return new ethers.Contract(
      UNISWAP_V2_ROUTER_ADDRESS,
      IUniswapV2Router02.abi,
      signer
    );
  }

  const approveToken = async (tokenAddress, amount, signer) => {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ],
      signer
    );

    const tx = await tokenContract.approve(
      UNISWAP_V2_ROUTER_ADDRESS,
      ethers.utils.parseUnits(amount.toString(), 18)
    );
    console.log("tx", tx);
    await tx.wait();
    console.log(`Approved ${amount} tokens for the Uniswap V2 Router`);
  };

  const addLiquidity = async (
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    signer
  ) => {
    const router = getRouterContract(signer);

    const amountAMin = ethers.utils.parseUnits(
      (amountADesired * 0.95).toString(),
      18
    ); // 5% slippage
    const amountBMin = ethers.utils.parseUnits(
      (amountBDesired * 0.95).toString(),
      18
    ); // 5% slippage
    const to = await signer.getAddress();
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current time

    const tx = await router.addLiquidity(
      tokenA,
      tokenB,
      ethers.utils.parseUnits(amountADesired.toString(), 18),
      ethers.utils.parseUnits(amountBDesired.toString(), 18),
      amountAMin,
      amountBMin,
      to,
      deadline
    );

    await tx.wait();
    console.log("Liquidity added:", tx);
  };

  const handleAddLiquidity = async () => {
    console.log("signer", signer);

    if (!signer) return;

    try {
      await approveToken(tokenOne?.address, tokenOneVal, signer);
      await approveToken(tokenTwo?.address, tokenTwoVal, signer);
      console.log("-------------1", tokenOne.address, tokenOneVal);
      console.log("--------------2", tokenTwo.address, tokenOneVal);

      await addLiquidity(
        tokenOne?.address,
        tokenTwo?.address,
        tokenOneVal,
        tokenTwoVal,
        signer
      );
      console.log("Liquidity added successfully!");
    } catch (error) {
      console.error("Error adding liquidity:", error);
    }
  };

  // useEffect(() => {
  //   const fetchAllTokens = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://unpkg.com/@uniswap/default-token-list@latest"
  //       );
  //       setAllTokens(response.data.tokens);
  //       setLoading(false);
  //     } catch (error) {
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllTokens();
  // }, []);

  useEffect(() => {
    if (t) {
      setAllTokens([...tokens, ...localToken]);
    } else {
      setAllTokens(tokens);
    }
  }, []);

  useEffect(() => {
    const newTokenList = [];
    allTokens?.map((token, index) => {
      if (token.chainId === netChainId) {
        newTokenList.push(token);
      }
      if (index === allTokens.length - 1) {
        setTokenList(newTokenList);
        setFilteredTokenList(newTokenList);
      }
    });
  }, [allTokens, netChainId]);

  useEffect(() => {
    const filteredList = [];
    const lowerCaseQuery = searchQuery?.trim().toLowerCase();
    tokenList?.map((token, index) => {
      if (
        token.symbol?.trim().toLowerCase().includes(lowerCaseQuery) ||
        token.name?.trim().toLowerCase().includes(lowerCaseQuery) ||
        token.address?.trim().toLowerCase() === searchQuery.trim().toLowerCase()
      ) {
        filteredList.push(token);
      }
      if (index === tokenList.length - 1) {
        setFilteredTokenList(filteredList);
      }
    });
  }, [searchQuery]);

  useEffect(() => {
    setFToken([]);
  }, [netChainId]);

  const refreshPage = () => {
    window.location.reload();
  };

  const fetchToken = async (searchQuery, chainId) => {
    try {
      await Moralis.start({
        apiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjFmNzFkYTMxLTdkOTEtNDI3ZC1hYWJiLWQwYjE4MTNmYzNmMSIsIm9yZ0lkIjoiNDA0NDcxIiwidXNlcklkIjoiNDE1NjA4IiwidHlwZUlkIjoiYTdhOWY0MWMtNTRhMC00NjcxLWEzOTQtMmZhNmIyYjhkZTA4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjM1MTQ0NDksImV4cCI6NDg3OTI3NDQ0OX0.boDtID7wHN4SftS2xAcOQbrYRA83ogI_BbGUzmok7RE",
      });

      const response = await Moralis.EvmApi.token.getTokenMetadata({
        chain:
          chainId === 56
            ? "0x38"
            : chainId === 1
            ? "0x1"
            : chainId === 8453
            ? "0x2105"
            : null,
        addresses: [String(searchQuery)],
      });
      if (!response.raw) {
        refreshPage();
      } else {
        setFToken(response.raw);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (searchQuery && filteredTokenList.length === 0) {
      fetchToken(searchQuery, netChainId);
    }
  }, [searchQuery, netChainId, filteredTokenList.length]);

  useEffect(() => {
    setTokenOne(tokenList[0]);
    setTokenTwo(tokenList[1]);
  }, [tokenList]);

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i) {
    if (changeToken === 1) {
      setTokenOne(filteredTokenList[i]);
    } else {
      setTokenTwo(filteredTokenList[i]);
    }
    setSearchQuery("");
    setIsOpen(false);
  }

  const minPriceRange = (text) => {
    if (text == "+") {
      setMinPrice(minPrice + 1);
    } else if (text == "-") {
      setMinPrice(minPrice - 1);
    }
  };

  const maxPriceRange = (text) => {
    if (text == "+") {
      setMaxPrice(maxPrice + 1);
    } else if (text == "-") {
      setMaxPrice(maxPrice - 1);
    }
  };

  const fullRange = () => {
    setRangeFlag(!rangeFlag);
    if (rangeFlag) {
      setMinPrice(0);
      setMaxPrice(Number.POSITIVE_INFINITY);
    } else {
      setMinPrice(0);
      setMaxPrice(0);
    }
  };

  const isBalanceSufficient = (walletBalance, tokenOneAmount) => {
    return walletBalance >= tokenOneAmount;
  };

  const isBalanceEnough = isBalanceSufficient(walletBalance, tokenOneVal);

  const closeModal = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const opneImport = () => {
    setIsOpenImport(true);
    setIsOpen(false);
    setSearchQuery("");
  };

  const importToken = () => {
    if (t) {
      localStorage.setItem(
        "token",
        JSON.stringify([...localToken, { ...fToken[0], chainId: netChainId }])
      );
    } else {
      localStorage.setItem(
        "token",
        JSON.stringify([{ ...fToken[0], chainId: netChainId }])
      );
    }
    setIsOpenImport(false);
    setFToken([]);
    setTokenOne(fToken[0]);
  };

  function switchScreen() {}

    return (
      <div className="poolAdd">
        <div className="poolAddBox">
          <div className="poolAddBoxHeader">
            <div
              className="poolAddBoxHeaderLeft"
              onClick={() => switchScreen()}
            >
              <ArrowLeftOutlined width={30} height={30} />
            </div>
            <div className="poolAddBoxHeaderMiddle">
              <p>Add Liquidity</p>
            </div>
            <div className="poolAddBoxHeaderRight">
              <p>Clear All</p>
              <CloseOutlined width={50} height={50} />
            </div>
          </div>
          <div className="poolAddBoxPrice">
            <div className="poolAddBoxPriceLeft">
              <h4>Select Pair</h4>
              <div className="poolAddBoxPriceLeftToken">
                <div
                  className="poolAddBoxPiceLeftTokenInfo"
                  onClick={() => openModal(1)}
                >
                  <p>
                    {tokenOne?.logo || tokenOne?.logoURI ? (
                      <img
                        src={tokenOne?.logo || tokenOne?.logoURI}
                        alt="assetOneLogo"
                        className="assetLogo"
                      />
                    ) : (
                      <div className="fLogo">{tokenOne?.symbol[0]}</div>
                    )}
                  </p>
                  <p>{tokenOne?.symbol}</p>
                  <p>
                    <ArrowDownOutlined />
                  </p>
                </div>
                <div
                  className="poolAddBoxPiceLeftTokenInfo"
                  onClick={() => openModal(2)}
                >
                  <p>
                    {tokenTwo?.logo || tokenTwo?.logoURI ? (
                      <img
                        src={tokenTwo?.logo || tokenTwo?.logoURI}
                        alt="assetTwoLogo"
                        className="assetLogo"
                      />
                    ) : (
                      <div className="fLogo">{tokenTwo?.symbol[0]}</div>
                    )}
                  </p>
                  <p>{tokenTwo?.symbol}</p>
                  <p>
                    <ArrowDownOutlined />
                  </p>
                </div>
              </div>
              <div className="poolAddBoxPriceLeftFee">
                <div className="poolAddBoxPriceLeftFeeLeft">
                  <h4>Fee Tier</h4>
                  <p>
                    The <b>%</b> you will earn in fees.
                  </p>
                </div>
                {openFee ? (
                  <button className="feeBtn" onClick={() => setOpenFee(false)}>
                    Hide
                  </button>
                ) : (
                  <button className="feeBtn" onClick={() => setOpenFee(true)}>
                    Show
                  </button>
                )}
              </div>
              {openFee && (
                <div className="poolAddBoxPriceLeftList">
                  {feePair.map((el, i) => (
                    <div
                      className="poolAddBoxPriceLeftListItem"
                      key={i + 1}
                      onClick={() => setActive(i + 1)}
                    >
                      <div className="poolAddBoxPriceLeftListItem">
                        <p>{el.fee}</p>
                        <p>
                          {active == i + 1 ? (
                            // correct this imgae variable
                            <img
                              src={TICK}
                              alt="ticker"
                              width={20}
                              height={20}
                            />
                          ) : (
                            ""
                          )}
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
                  <input
                    type="text"
                    placeholder="0"
                    value={tokenOneVal}
                    onChange={(e) => setTokenOneVal(e.target.value)}
                  />
                  <div className="poolAddBoxDepositBoxInput">
                    <p>
                      <small>{tokenOne?.symbol}</small>
                      {tokenOne?.name}
                    </p>
                    <p className="poolAddBoxDepositBoxInputItem">
                      {walletBalance !== null
                        ? "Balance: " +
                          walletBalance.toFixed(tokenDecimals).slice(0, -12)
                        : " "}
                    </p>
                  </div>
                </div>
                <div className="poolAddBoxDepositBox">
                  <input
                    type="text"
                    placeholder="0"
                    value={tokenTwoVal}
                    onChange={(e) => setTokenTwoVal(e.target.value)}
                  />
                  <div className="poolAddBoxDepositBoxInput">
                    <p>
                      <small>{tokenTwo?.symbol}</small>
                      {tokenTwo?.name}
                    </p>
                    <p className="poolAddBoxDepositBoxInputItem">
                      {tokenTwoBalance !== null
                        ? "Balance: " +
                          tokenTwoBalance
                            .toFixed(tokenTwoDecimals)
                            .slice(0, -12)
                        : " "}
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
                <img src={WALLET} alt="wallet" width={80} height={80} />
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
                    <small>-</small> {maxPrice === Infinity ? "∞" : maxPrice}{" "}
                    <small>+</small>
                  </p>
                  <p>Testv4 per WETH</p>
                </div>
              </div>
              <div
                className="poolAddBoxPriceRightButton"
                onClick={() => fullRange()}
              >
                <button>Full Range</button>
              </div>
              <div className="poolAddBoxPriceRightAmount">
                <button
                  disabled={!isConnected || !isBalanceEnough}
                  onClick={handleAddLiquidity}
                >
                  {isBalanceEnough
                    ? "create"
                    : `Insufficient ${tokenOne?.symbol} balance`}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          open={isOpen}
          footer={null}
          onCancel={() => closeModal()}
          title="Select a token"
        >
          <input
            type="text"
            name="currency"
            className="currencyInput"
            placeholder="Search name or paste address"
            value={searchQuery}
            autoFocus
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="modalContent">
            {filteredTokenList?.map((e, i) => {
              return (
                <div
                  className="tokenChoice"
                  key={i}
                  onClick={() => modifyToken(i)}
                >
                  {e.logo || e.logoURI ? (
                    <img
                      src={e.logo || e.logoURI}
                      alt={e.symbol}
                      className="tokenLogo"
                    />
                  ) : (
                    <div className="fTokenLogo">{e.symbol[0]}</div>
                  )}
                  <div className="tokenChoiceNames">
                    <div className="tokenName">{e.name}</div>
                    <div className="tokenTicker">{e.symbol}</div>
                  </div>
                </div>
              );
            })}
            {filteredTokenList.length === 0 &&
              fToken?.map((e, i) => {
                return (
                  <div className="tokenChoice" key={i} onClick={opneImport}>
                    {e.logo ? (
                      <img src={e.logo} alt={e.symbol} className="tokenLogo" />
                    ) : (
                      <div className="fTokenLogo">{e.symbol[0]}</div>
                    )}
                    <div className="tokenChoiceNames">
                      <div className="tokenName">{e.name}</div>
                      <div className="tokenTicker">{e.symbol}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Modal>
        <Modal
          open={isOpenImport}
          footer={null}
          onCancel={() => setIsOpenImport(false)}
          title="Import Token"
          centered={true}
        >
          <div className="modalContent">
            <p>Do you really import this token?</p>
            <button className="importBtn" onClick={importToken}>
              Import
            </button>
          </div>
        </Modal>
      </div>
    );
 
};

export default PoolAdd;
