import { DelegateButton } from "@/components/DelegateButton";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="bg-gray-900 w-full text-white text-center">
      <Head>
        <title>Delegate to SIDAN Lab</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className} `}
      >
        <h1 className="text-6xl font-thin mb-20">Delegate to SIDAN Lab</h1>

        <div className="mb-20">
          {connected ? <DelegateButton /> : <CardanoWallet isDark />}
        </div>

        <div className="flex content-center justify-center ">
          <div className="bg-gray-800 rounded-xl border border-white transition p-5 m-5 w-[80%]">
            <h2 className="text-2xl font-bold mb-2">Delegate to SIDAN Lab</h2>
            <p className="text-gray-400">
              Support us by delegating your stake and DRep to SIDAN Lab!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
