import { useEffect, useState } from "react";
import { Popover } from "antd";
//import axios from "axios";
import styles from "../styles/Home.module.css";
//import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../contracts/index.js";

export default function Staking() {
  // const { isConnected, address } = useAccount();
  // const provider = useProvider();
  // const { data: signer } = useSigner();

  const [walletBalance, setWalletBalance] = useState("");

  const [stakingTab, setStakingTab] = useState(true);
  const [unstakingTab, setUnstakingTab] = useState(false);
  const [unstakeValue, setUnstakeValue] = useState(0);

  const [assetIds, setAssetIds] = useState([]);
  const [assets, setAssets] = useState([]);
  const [amount, setAmount] = useState(0);

  const toWei = (ether) => ethers.utils.parseEther(ether);
  const toEther = (wei) => ethers.utils.formatEther(wei);

  // const addressed = useEffect(() => {
  //   async function getWalletBalance() {
  //     await axios
  //       .get("http://localhost:5001/getwalletbalance", {
  //         params: { address },
  //       })
  //       .then((response) => {
  //         setWalletBalance(response.data.balance);
  //       });
  //   }

  //   if (isConnected) {
  //     getWalletBalance();
  //   }
  // }, [isConnected]);

  // const contract = useContract({
  //   address: CONTRACT_ADDRESS,
  //   abi: ABI,
  //   signerOrProvider: signer || provider,
  // });

  const switchToUnstake = async () => {
    if (!unstakingTab) {
      setUnstakingTab(true);
      setStakingTab(false);
      // const assetIds = await getAssetIds(address, signer);
      // setAssetIds(assetIds);

      //getAssets(assetIds, signer);
    }
  };

  const switchToStake = () => {
    if (!stakingTab) {
      setStakingTab(true);
      setUnstakingTab(false);
    }
  };

  const getAssetIds = async (address) => {
    // const assetIds = await contract.getPositionIdsForAddress(address);
    // return assetIds;
  };

  const calcDaysRemaining = (unlockDate) => {
    const timeNow = Date.now() / 1000;
    const secondsRemaining = unlockDate - timeNow;
    return Math.max((secondsRemaining / 60 / 60 / 24).toFixed(0), 0);
  };

  // const getAssets = async (ids) => {
  //   const queriedAssets = await Promise.all(
  //     ids.map((id) => contract.withdraw(id)) //contract.getPositionById(id)
  //   )
  //   ;

  //   queriedAssets.map(async (asset) => {
  //     const parsedAsset = {
  //       positionId: asset.positionId,
  //       percentInterest: Number(asset.percentInterest) / 100,
  //       daysRemaining: calcDaysRemaining(Number(asset.unlockDate)),
  //       etherInterest: toEther(asset.weiInterest),
  //       etherStaked: toEther(asset.weiStaked),
  //       open: asset.open,
  //     };

  //     setAssets((prev) => [...prev, parsedAsset]);
  //   });
  // };

  const stakeEther = async (stakingLength) => {
    const wei = toWei(String(amount));
    const data = { value: wei };
    //await contract.stakeEther(stakingLength, data);
  };

  const withdraw = (positionId) => {
    //contract.closePosition(positionId);
  };

  return (
    <section className={styles.stakingContainer}>
      <section className="descDog">
      <div className="dogStaking">
      <h2 className="nftDetails">$WDOG Staking</h2>
      <p className="stakeDesc">
        <div>
        The <b>WatchDog Token Staking</b> feature has been designed
        to allow <b>$WDOG</b> holders earn passing income by staking <b>$WDOG</b> tokens.
        <br/>
        <br/>
        The <b>$WDOG</b> tokens paid as rewards to stakers is derived from the <b>$WDOG</b> buy-back per secure swap on <b>WatchDogSwap</b>.
        <br/>
        <br/>
        For every swap executed using <b>WatchDogSwap</b>, part of the revenue generated as <b>WETH</b> is swapped to <b>$WDOG</b> and transferred to the 
         <b><a href= "https://etherscan.io/"> WatchDog Staking Contract</a></b> and distributed as rewards to stakers.
         <br/>
         <br/>
        The buy-back feature not only guarantees <b>$WDOG</b> rewards for stakers but also functions as a <b>$WDOG</b> token price consolidation mechanism. 
        Thereby continually strengthening the <b>$WDOG</b> token price.
        <br/>
        <br/>
        Stakers would need to stake <b>$WDOG</b> for <b>48hrs</b> in order to receive rewards.
        <br/>
        <br/>
        The <b>$WDOG</b> reward paid to stakers is calculated using the current percentage staked by the staker in the staking pool at the time of reward.
        <br/>
        <br/>
        This means that if a staker has <b>50%</b> of the total staked <b>$WDOG</b> in the staking pool the staker would be eligible to receive <b>50%</b> of
         the staking rewards at that time.
        <br/>
        <br/>

      </div>
      </p>
      </div>
      </section>
      <section>
        <section className={styles.stakeUnstakeTab}>
          <section
            className={`${stakingTab ? styles.stakingType : ""}`}
            id="stake"
            onClick={switchToStake}
          >
            <b>Stake</b>
          </section>
          <section
            className={`${unstakingTab ? styles.stakingType : ""}`}
            id="unstake"
            onClick={switchToUnstake}
          >
            <b>Unstake</b>
          </section>
        </section>
        <section className={styles.stakingSection}>
          <span className={styles.apy}></span>
          {stakingTab ? (
            <section className={styles.stakingBox}>
              <h2>Stake</h2>
              <input
                className={styles.inputField}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                id="inputField"
                maxLength="120"
                placeholder="Enter Stake Amount"
                required
              />
              <section className={styles.stakingInfo}>
                <p>
                  Balance:{" "}
                  <span>
                    {(walletBalance / 10 ** 18).toLocaleString()}
                    
                    </span>
                </p>
                <p>Reward Rate: 1.03582967</p>
                <p>Transaction Cost</p>
              </section>
              <button
                className={styles.stakeBtn}
                onClick={() => stakeEther(0, "7%")}
              >
                STAKE
              </button>
            </section>
          ) : (
            <section className={styles.stakingBox}>
              <h2>Unstake</h2>
              <input
                className={styles.inputField}
                value={unstakeValue}
                onChange={(e) => setUnstakeValue(e.target.value)}
                type="number"
                id="inputField"
                maxLength="120"
                placeholder="Enter Unstake Amount"
                required
              />
              <section className={styles.stakingInfo}>
                <p>
                  Balance:
                </p>
                <p>Transaction Cost</p>
                <p>
                  You Receive: {unstakeValue == 0 ? "" : unstakeValue * 1.07}
                </p>
              </section>
              <button
                className={styles.stakeBtn}
                onClick={() => withdraw(assets[assets.length - 1].positionId)}
              >
                UNSTAKE
              </button>
            </section>
          )}
        </section>
      </section>
    </section>
  );
}
