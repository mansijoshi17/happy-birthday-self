"use client";

import React, { useState, useEffect } from "react";
import { countries, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import { SelfAppBuilder } from "@selfxyz/qrcode";
import { logo } from "./content/birthdayAppLogo";
import { ethers } from "ethers";

// SelfHappyBirthday contract address deployed on Celo Alfajores testnet
const HAPPY_BIRTHDAY_CONTRACT_ADDRESS =
  "0xf913b6a387e15f0fcdbb1d8ce4c16c34927c0542";

// const HUMAN_PROOF_CONTRACT_ADDRESS =
//   "0xa5564fe4ad705cfa5fe159ed7529aa172188afe9";
// const humanProofScope = "proof-of-human";

function Birthday() {
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");

  const [claimSuccess, setClaimSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [selfApp, setSelfApp] = useState<any | null>(null);

  useEffect(() => {
    const userId = "0xYourUserEthAddress"; // or a UUID depending on your setup

    const app = new SelfAppBuilder({
      version: 2,
      appName: "Human Proof",
      scope: "bday-reward",
      endpoint: `${HAPPY_BIRTHDAY_CONTRACT_ADDRESS}`,
      endpointType: "staging_celo",
      logoBase64: logo,
      userId: "0x3Fe0ab910eA2f59D4E7ee7375FA69Acff238B798",
      userIdType: "hex",
      userDefinedData: "Hello from the Docs!!",
      disclosures: {
        // What you want to verify from the user's identity
        minimumAge: 18,
      },
    }).build();

    setSelfApp(app);
  }, []);

  const handleSuccess = async (data?: any) => {
    console.log("Verification successful", data);
    setClaimSuccess(true);
    // If we get a tx hash from the data, use it
    if (data?.txHash) {
      setTxHash(data.txHash);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-8">
            <img src="/self.svg" alt="Self Logo" className="h-8" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/zk-passport/openpassport"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-800 transition-colors"
          >
            <span className="mr-2">Star on Github</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a
            className="flex items-center justify-center gap-2 hover:underline hover:underline-offset-4"
            href="https://self.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to self.xyz →
          </a>
        </div>
      </nav>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            🎉 It&apos;s your birthday? Claim 1 USDC 🎂 🎁
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Enter your wallet address:
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="0x..."
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {selfApp ? (
            <SelfQRcodeWrapper
              selfApp={selfApp}
              onSuccess={handleSuccess}
              onError={() => {
                console.error("Error: Failed to verify identity");
              }}
            />
          ) : (
            <div>
              <p>Loading QR Code...</p>
            </div>
          )}

          {claimSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🎉 Congratulations! Birthday USDC Claimed!
              </h3>
              <p className="text-sm text-green-700 mb-3">
                You have successfully claimed 1 USDC to your wallet address.
              </p>
              <div className="space-y-2">
                {txHash ? (
                  <a
                    href={`https://alfajores.celoscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    View Transaction on Celoscan →
                  </a>
                ) : (
                  <a
                    href={`https://alfajores.celoscan.io/address/${address}#tokentxns`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    View Your Token Transfers on Celoscan →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Birthday;
