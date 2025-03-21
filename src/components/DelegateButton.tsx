import { useValidateStaking } from "@/lib/hooks/useValidateStaking";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface DelegateButtonProps {
  onDelegate: () => Promise<void>;
}

export const DelegateButton = ({ onDelegate }: DelegateButtonProps) => {
  const [error, setError] = useState(false);
  const {
    isDRepDelegated,
    isStaked,
    error: walletError,
  } = useValidateStaking();

  const onClick = async () => {
    if (walletError) {
      return;
    }

    if (!isStaked || !isDRepDelegated) {
      try {
        await onDelegate();
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
        {walletError ? "Wallet Error" : "Delegate to Sidan"}
      </button>

      {error && (
        <p className="text-danger">
          An error occurred while delegating stake and DRep to SIDAN Lab. Please
          try again
        </p>
      )}

      {walletError && (
        <p className="text-danger">
          An error occurred connecting wallet. Your wallet is either not
          connected, not supported, or not in the same network as the SIDAN Lab.
          Please try again.
        </p>
      )}
    </div>
  );
};
