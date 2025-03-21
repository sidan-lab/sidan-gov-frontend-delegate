import { useValidateStaking } from "@/lib/hooks/useValidateStaking";
import { DELEGATE_TEXT, ERROR_TEXT } from "@/lib/text";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const DelegateButton = () => {
  const [error, setError] = useState(false);
  const {
    isDRepDelegated,
    isStaked,
    delegateToSidan,
    error: walletError,
  } = useValidateStaking();

  const onClick = async () => {
    if (walletError) {
      return;
    }

    if (!isStaked || !isDRepDelegated) {
      try {
        await delegateToSidan();
      } catch (error) {
        console.log("Error: ", error);
        setError(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onClick}
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

      {error && (
        <p className="text-danger">
          An error occurred while delegating to SIDAN Lab. Please try again
        </p>
      )}

      {walletError && <p className="text-danger">{ERROR_TEXT.WALLET}</p>}
    </div>
  );
};
