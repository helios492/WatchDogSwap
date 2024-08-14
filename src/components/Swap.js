import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Bark from "../DogBark.mp3";
import Growl from "../DogGrowl.mp3";
import { CONTRACT_ADDRESS, ABI, TOKEN_ABI } from "../contracts/index.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ChainIdState } from "../contexts/ChainIdContext.js";
import { getAccount } from "wagmi/actions";
import { config } from "../config.js";
import Moralis from "moralis";
import tokens from "../tokenList.json";

function Swap(props) {
  const { address, isConnected } = props;
  const ethereumProvider = window.ethereum;
  const [allTokens, setAllTokens] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [filteredTokenList, setFilteredTokenList] = useState([]);
  const [fToken, setFToken] = useState();
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [isHoneyPot, setisHoneyPot] = useState(null);
  const [slippage, setSlippage] = useState(0.5);
  const [salePriceTwo, setSalePriceTwo] = useState("$0.369");
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);
  const [tokenTwoDecimals, setTokenTwoDecimals] = useState(null);
  const [blockTimestamp, setBlockTimestamp] = useState(null);

  const [minutes, setMinutes] = useState(10);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState();
  const [tokenTwo, setTokenTwo] = useState();
  const [isTokenApproved, setIsTokenApproved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [isAutoSetAll, setIsAutoSetAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { netChainId } = ChainIdState();
  const t = localStorage.getItem("token");
  const localToken = t ? JSON.parse(t) : [];

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

  useEffect(()=>{
    setFToken([]);
  },[netChainId])
  
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
      if(!response.raw) {
        refreshPage();
      }else{
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

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  function handleMinuteChange(e) {
    setMinutes(e.target.value);
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
  }

  function switchTokens() {
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }

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

  const handleAutoSetAllToggle = () => {
    setIsAutoSetAll(!isAutoSetAll);
  };

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
      <Radio.Group value={slippage} onChange={handleSlippageChange}>
        <div>
          <Radio.Button>Set</Radio.Button>
          <input
            className="minute"
            placeholder="Enter Slippage"
            value={slippage}
            onChange={handleSlippageChange}
          />
        </div>
      </Radio.Group>
      <div>
        <br />
        <div className="space-y-4">Transaction Deadline</div>
        <Radio.Group>
          <div>
            <input
              className="minute"
              placeholder="Enter Minute"
              value={minutes}
              onChange={handleMinuteChange}
            />
            <Radio.Button>minutes</Radio.Button>
          </div>
        </Radio.Group>
      </div>
      <div>Auto Slippage Settings</div>
      <div>
        <Radio.Button onClick={handleAutoSetAllToggle}>
          {isAutoSetAll
            ? "Disable Auto Slippage Settings"
            : "Enable Auto Slippage Settings"}
        </Radio.Button>
      </div>
    </>
  );

  //Approve Function
  const approveToken = async () => {
    try {
      // Request account access if needed
      const account = getAccount(config);

      // Create a Web3 instance using the current provider
      const web3 = new Web3(ethereumProvider);

      // Create a contract instance
      const tokenContract = new web3.eth.Contract(TOKEN_ABI, tokenOne.address);

      // Convert tokenOneAmount to wei
      const amountInWei = web3.utils.toWei(tokenOneAmount.toString(), "ether");

      setTransactionPending(true);

      let result = await tokenContract.methods
        .approve(CONTRACT_ADDRESS, amountInWei)
        .send({
          from: address,
        });

      setTransactionPending(false);
      toast.success("Approve transaction Successful!");

      setIsTokenApproved(true);
      console.log("Approve transaction successful:", result);
    } catch (error) {
      setTransactionPending(false);
      toast.error(`Approve transaction Failed: ${error.message}`);
      console.error("Error interacting with the contract:", error);
    }
  };

  //Swap Function
  const swapToken = async () => {
    try {
      // Create a Web3 instance using the current provider
      const web3 = new Web3(ethereumProvider);

      // Create a contract instance
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

      // Create a contract instance
      const tokenContract = new web3.eth.Contract(TOKEN_ABI, tokenOne?.address);

      // Convert tokenOneAmount to wei
      const amountInWei = web3.utils.toWei(tokenOneAmount.toString(), "ether");

      const path = [tokenOne?.address, tokenTwo?.address];

      dogGrowl();

      setTransactionPending(true);

      let result = await contract.methods
        .swapExactTokensForTokens(
          amountInWei,
          0,
          path,
          ethereumProvider.selectedAddress,
          blockTimestamp
        )
        .send({
          from: address,
        });

      // Check Token allowance for contract
      let allowance = await tokenContract.methods
        .allowance(ethereumProvider.selectedAddress, CONTRACT_ADDRESS)
        .call();

      // Convert BigInt to regular number
      allowance = Number(allowance);

      console.log(`Token allowance: ${allowance}`);

      if (tokenOneAmount > allowance) {
        // If allowance is less than tokenOneAmount
        setIsTokenApproved(false);
      }
      console.log("Swap transaction successful:", result);
      setTransactionPending(false);
      toast.success("Swap Successful!");
    } catch (error) {
      setisHoneyPot(true);
      setTransactionPending(false);
      toast.error(`Swap Failed: ${error.message}`);
      dogBark();
      //Add to Honeypot JSON
      console.error("Error interacting with the contract:", error);
    }
  };

  // Create a ref to store the audio element
  const audioRef = useRef(null);

  // Function to handle HoneyPot Detection audio
  const dogBark = () => {
    const audioFile = Bark;

    // Set the source of the audio element
    audioRef.current.src = audioFile;

    // Play the audio using the ref
    audioRef.current.play();
  };

  // Function to handle HoneyPot Pre-Detection audio
  const dogGrowl = () => {
    const audioFile = Growl;

    // Set the source of the audio element
    audioRef.current.src = audioFile;

    // Play the audio using the ref
    audioRef.current.play();
  };

  // Check BlockTimestamp when the component mounts
  useEffect(() => {
    const fetchBlockTimestamp = async () => {
      if (isConnected) {
        const web3 = new Web3(ethereumProvider);

        // Get the latest block number
        const blockNumber = await web3.eth.getBlockNumber();

        // Get the block information using the block number
        const block = await web3.eth.getBlock(blockNumber);

        // Access the timestamp from the block
        let timestamp = block.timestamp;

        timestamp = Number(timestamp);

        // Add Minutes variable to the timestamp
        const newtamp = timestamp * 1000 + minutes * 60 * 1000;

        console.log(`Timestamp check: ${newtamp}`);

        setBlockTimestamp(newtamp);

        console.log(`blockTimestamp check: ${blockTimestamp}`);
        console.log(`Timestamp of the latest block: ${timestamp}`);
      }
    };

    fetchBlockTimestamp();
  }, [ethereumProvider]);

  //Get Token Decimals
  useEffect(() => {
    const checkTokenDecimals = async () => {
      if (isConnected) {
        // Create a Web3 instance using the current provider
        const web3 = new Web3(ethereumProvider);

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
  }, [ethereumProvider, tokenOne?.address, TOKEN_ABI]);

  // Check Token Balance when the component mounts
  useEffect(() => {
    const checkTokenBalance = async () => {
      if (isConnected) {
        // Create a Web3 instance using the current provider
        const web3 = new Web3(ethereumProvider);

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
  }, [ethereumProvider, tokenOne?.address, TOKEN_ABI]);

  // Check Token approval status when the component mounts
  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (isConnected) {
        // Create a Web3 instance using the current provider
        const web3 = new Web3(ethereumProvider);

        // Create a contract instance
        const tokenContract = new web3.eth.Contract(
          TOKEN_ABI,
          tokenOne?.address
        );

        // Convert tokenOneAmount to wei
        const amountInWei = web3.utils.toWei(
          tokenOneAmount.toString(),
          "ether"
        );

        // Check Token allowance for contract
        let allowance = await tokenContract.methods
          .allowance(ethereumProvider.selectedAddress, CONTRACT_ADDRESS)
          .call();

        // Convert BigInt to regular number
        allowance = Number(allowance);

        console.log(`Token allowance: ${allowance}`);

        if (amountInWei > 1) {
          // If allowance is greater than or equal to amountInWei, set approve
          if (allowance >= amountInWei) {
            setIsTokenApproved(true);
          }
        }
      }
    };

    checkApprovalStatus();
  }, [ethereumProvider, tokenOne?.address, TOKEN_ABI]);

  //Get Swap Amount
  useEffect(() => {
    const getSwapAmount = async () => {
      //Implement logic for getAmountOut

      //Implement logic for slippage

      setTokenTwoAmount(tokenOneAmount); // <======REMOVE
      console.log(`Swap Amount: ${tokenTwoAmount}`);
    };

    getSwapAmount();
  }, [tokenOneAmount]);

  // Replace it with your actual logic
  const isBalanceSufficient = (walletBalance, tokenOneAmount) => {
    return walletBalance >= tokenOneAmount;
  };

  const isBalanceEnough = isBalanceSufficient(walletBalance, tokenOneAmount);

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

  return (
    <>
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
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
          />
          <div className="assetOnePrice">
            {walletBalance !== null
              ? "Balance: " + walletBalance.toFixed(tokenDecimals).slice(0, -12)
              : " "}
          </div>
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            {tokenOne?.logo || tokenOne?.logoURI ? (
              <img
                src={tokenOne?.logo || tokenOne?.logoURI}
                alt="assetOneLogo"
                className="assetLogo"
              />
            ) : (
              <div className="fLogo">{tokenOne?.symbol[0]}</div>
            )}
            {tokenOne?.symbol}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            {tokenTwo?.logo || tokenTwo?.logoURI ? (
              <img
                src={tokenTwo?.logo || tokenTwo?.logoURI}
                alt="assetTwoLogo"
                className="assetLogo"
              />
            ) : (
              <div className="fLogo">{tokenTwo?.symbol[0]}</div>
            )}
            {tokenTwo?.symbol}
            <DownOutlined />
          </div>
          <div className="assetTwoPrice">
            {tokenTwoBalance !== null
              ? "Balance: " +
                tokenTwoBalance.toFixed(tokenTwoDecimals).slice(0, -12)
              : " "}
          </div>
        </div>
        <div
          className="swapButton"
          disabled={!tokenOneAmount || !isConnected || !isBalanceEnough}
          onClick={
            isTokenApproved ||
            tokenOne?.address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
              ? swapToken
              : approveToken
          }
        >
          {isBalanceEnough
            ? isTokenApproved ||
              tokenOne?.address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
              ? "Swap"
              : "Approve"
            : `Insufficient ${tokenOne?.symbol} balance`}
          <audio ref={audioRef} />
        </div>

        {isTransactionPending && (
          <p className="pending-message">
            Please wait___________________________________
          </p>
        )}

        <ToastContainer />
      </div>
    </>
  );
}

export default Swap;
