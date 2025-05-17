import { BrowserWallet } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { DelegateTransactionActions } from "../cardano/stakeToSidan";

// Custom hook used to validate staking status of user. Used in other projects as well.
export const useValidateStaking = () => {
  const walletInfo = useWallet();

  const [wallet, setBrowserWallet] = useState<BrowserWallet | null>(null);
  const [rewardAddress, setRewardAddress] = useState<string | null>(null);

  const [error, setError] = useState<string>("");
  const [transactionLoading, setLoading] = useState(0);

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isStaked, setIsStaked] = useState<boolean>(false);
  const [isDRepDelegated, setIsDRepDelegated] = useState<boolean>(false);

  const resetState = () => {
    setIsDRepDelegated(false);
    setIsStaked(false);
    setIsRegistered(false);
  };

  const updateStateForConnect = () => {
    setIsDRepDelegated(true);
    setIsStaked(true);
    setIsRegistered(true);
    setLoading(120);
  };

  useEffect(() => {
    if (transactionLoading > 0) {
      const countdownInterval = setInterval(() => {
        setLoading((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [transactionLoading, setLoading]);

  const checkAddressInfo = async (stakeAddress: string) => {
    if (!stakeAddress) {
      setError("wallet_connect");
      return;
    }

    try {
      const response = await axios.post("/api/checkIfStaked", {
        rewardAddress: stakeAddress,
      });

      const { status, data } = response;

      if (status === 422 || status === 500) {
        resetState();
        return;
      }

      const { isRegistered, isStaked, isDRepDelegated } = data.data;
      setIsDRepDelegated(isDRepDelegated);
      setIsStaked(isStaked);
      setIsRegistered(isRegistered);
    } catch (error) {
      console.log("Error: ", error);
      resetState();
      setError("wallet_connect");
    }
  };

  const delegateToSidan = useCallback(async () => {
    if (!rewardAddress) {
      setError("wallet_connect");
      return;
    }
    if (!wallet) {
      setError("wallet_connect");
      return;
    }
    try {
      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();
      let actions: DelegateTransactionActions[] = [];
      if (!isRegistered) {
        actions.push("registerStakeAddress");
      }
      if (!isStaked) {
        actions.push("delegateStake");
      }
      if (!isDRepDelegated) {
        actions.push("voteDelegation");
      }
      const response = await axios.post("/api/stakeToSidan", {
        rewardAddress,
        utxos,
        changeAddress,
        actions,
      });
      const { unsignedTx } = response.data.data;
      if (unsignedTx) {
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);

        if (txHash) {
          console.log("Submitted transaction with hash:" + txHash);
          updateStateForConnect();
        }
      }
    } catch (error) {
      setError("wallet_sign");
      console.log("Error: ", error);
      resetState();
    }
  }, [rewardAddress, wallet, isRegistered, isStaked, isDRepDelegated]);

  useEffect(() => {
    setError("");
    if (walletInfo.name) {
      BrowserWallet.enable(walletInfo.name).then((wallet) => {
        setBrowserWallet(wallet);
        wallet.getRewardAddresses().then((addresses) => {
          if (addresses.length > 0 && addresses[0]) {
            setRewardAddress(addresses[0]);
            checkAddressInfo(addresses[0]);
          }
        });
      });
    }
  }, [walletInfo.name]);

  return {
    rewardAddress,
    delegateToSidan,
    error,
    wallet,
    isStaked,
    isDRepDelegated,
    isRegistered,
    updateStateForConnect,
    transactionLoading,
    setLoading,
  };
};
