import { DiscordConnectButton } from "@/components/DiscordConnectButton";
import { INSTRUCTION_TEXT, TITLE_TEXT } from "@/lib/text";
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
        <h1 className="text-6xl font-thin mb-20">{TITLE_TEXT}</h1>

        <div className="mb-20">
          {connected ? (
            <DiscordConnectButton discord_id={query.discordId as string} />
          ) : (
            <CardanoWallet isDark />
          )}
        </div>

        <div className="flex content-center justify-center ">
          <div className="bg-gray-800 rounded-xl border border-white transition p-5 m-5 w-[80%]">
            <h2 className="text-2xl font-bold mb-2">Instructions</h2>
            <p className="text-gray-400">{INSTRUCTION_TEXT}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
