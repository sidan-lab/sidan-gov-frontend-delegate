import { stakeToSidan } from "@/lib/cardano/stakeToSidan";
import type { NextApiRequest, NextApiResponse } from "next";

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
      const { unsignedTx } = await stakeToSidan(req.body);
      if (unsignedTx) {
        res.status(201).json({
          message: "success",
          data: {
            unsignedTx,
          },
        });
      } else {
        res.status(203).json({ message: "failed" });
      }
    } else {
      res.status(422).json({ error: "Only POST requests allowed" });
    }
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
