import { checkIfStaked } from "@/lib/cardano/checkIfStaked";
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  rewardAddress: string;
};

type Data =
  | {
      message: string;
      data?: any;
    }
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      const { rewardAddress }: Body = req.body;
      const { isRegistered, isStaked, isDRepDelegated } = await checkIfStaked(
        rewardAddress
      );
      if (isStaked && isDRepDelegated) {
        res.status(201).json({
          message: "success",
          data: {
            isRegistered,
            isStaked,
            isDRepDelegated,
          },
        });
      } else {
        if (isRegistered) {
          res.status(202).json({
            message: "registered but not staked or delegated",
            data: {
              isRegistered,
              isStaked,
              isDRepDelegated,
            },
          });
        } else {
          res.status(203).json({
            message: "not registered",
            data: {
              isRegistered,
              isStaked,
              isDRepDelegated,
            },
          });
        }
      }
    } else {
      res.status(422).json({ error: "Only POST requests allowed" });
    }
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
