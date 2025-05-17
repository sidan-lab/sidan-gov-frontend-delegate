import { useValidateStaking } from "@/lib/hooks/useValidateStaking";
import { DELEGATE_TEXT, ERROR_TEXT, SUCCESS_TEXT } from "@/lib/text";
import { cn } from "@/lib/utils";
import { useAddress, useWallet } from "@meshsdk/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loading } from "./Loading";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL!;
const DELEGATE_CHANNEL_LINK = process.env.NEXT_PUBLIC_DELEGATE_CHANNEL_LINK!;

export interface DiscordConnectButtonProps {
  discord_id?: string;
  walletConnected?: boolean;
}

export const DiscordConnectButton = ({
  discord_id = "",
}: DiscordConnectButtonProps) => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [lovelace, setLovelace] = useState(0);

  const {
    isStaked,
    isDRepDelegated,
    error: walletError,
    transactionLoading: loading,
    setLoading,
    delegateToSidan,
  } = useValidateStaking();
  const address = useAddress();
  const { wallet } = useWallet();

  useEffect(() => {
    if (wallet) {
      wallet.getLovelace().then((value) => {
        setLovelace(+value);
      });
    }
  }, [wallet]);

  const onDelegate = async () => {
    if (walletError) {
      return;
    }

    await delegateToSidan();
  };

  const onClick = async () => {
    if (success) {
      if (!DELEGATE_CHANNEL_LINK) {
        setError(ERROR_TEXT.REDIRECT);
      }

      return window.open(DELEGATE_CHANNEL_LINK, "_blank");
    }

    // Should be blocked on component level, but added this for safety measure
    if (walletError || !isStaked || !isDRepDelegated) {
      return;
    }

    const requestBody = {
      discord_id,
      is_staked_to_sidan: isStaked,
      is_drep_delegated_to_sidan: isDRepDelegated,
      wallet_address: address,
      stake_key_lovelace: lovelace,
    };

    try {
      const result = await axios.post(
        `${BACKEND_API_URL}/user/signIn`,
        requestBody
      );

      if (result) {
        setError("");
        setSuccess(SUCCESS_TEXT.API);
      } else {
        setError(ERROR_TEXT.API);
        setSuccess("");
      }
    } catch (error) {
      console.log(error);
      setError(ERROR_TEXT.API);
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {loading > 0 && (
        <div className="flex justify-center flex-col items-center w-full p-4">
          <Loading />

          <span>{`Waiting transaction to be completed in ${loading}s...`}</span>
          <span>
            You could{" "}
            <button
              className="text-teal-600 underline"
              onClick={() => setLoading(0)}
            >
              skip the timer
            </button>{" "}
            or come back later after the transaction is completed
          </span>
        </div>
      )}

      {!isStaked || !isDRepDelegated ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onDelegate}
            className={cn(
              "btn z-10 h-full whitespace-nowrap bg-gray-800 rounded-xl border border-white transition px-8 py-4",
              {
                "cursor-not-allowed": walletError,
                "cursor-pointer hover:scale-105": !walletError,
              }
            )}
          >
            {walletError ? "Wallet Error" : DELEGATE_TEXT}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onClick}
            className={cn(
              "btn z-10 h-full whitespace-nowrap bg-gray-800 rounded-xl border border-white transition px-8 py-4",
              {
                "cursor-not-allowed disabled text-gray-400 bg-gray-600":
                  walletError || loading > 0,
                "cursor-pointer hover:scale-105": !walletError && loading === 0,
              }
            )}
          >
            {success ? "Continue in Discord" : "Connect to Discord"}
          </button>
        </div>
      )}

      {success && <p className="text-success">{success}</p>}

      {error && <p className="text-danger">{error}</p>}

      {walletError && (
        <p className="text-danger">
          {walletError === "wallet_sign"
            ? ERROR_TEXT.WALLET_SIGN
            : ERROR_TEXT.WALLET_CONNECT}
        </p>
      )}
    </div>
  );
};
