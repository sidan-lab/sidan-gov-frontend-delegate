import { DiscordConnectButton } from "@/components/DiscordConnectButton";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Connect() {
  const { connected } = useWallet();
  const { query } = useRouter();

  return (
    <div className="bg-gray-900 w-full text-white text-center">
      <Head>
        <title>Delegate to SIDAN Lab</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className} `}
      >
        <h1 className="text-6xl font-thin mb-20">
          Delegate to SIDAN Lab & Connect to Discord
        </h1>

        <div className="mb-20">
          {connected ? (
            <DiscordConnectButton discord_id={query.discordId as string} />
          ) : (
            <CardanoWallet />
          )}
        </div>

        <div className="flex content-center justify-center ">
          <div className="bg-gray-800 rounded-xl border border-white transition p-5 m-5 w-[80%]">
            <h2 className="text-2xl font-bold mb-2">Instructions</h2>
            <p className="text-gray-400">
              Before accessing our discord governance functions, you have to
              delegate stake and DRep to Sidan first by connecting your wallet
              and clicking the button above.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
