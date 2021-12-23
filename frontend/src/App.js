import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect, useState, useContext } from "react";

import alertContext from "./context/alertContext";

import {
  getConnectedContract,
  isAccountConnectedOnRinkeby,
} from "./utils/metamask";

import HexagonLoader from "./HexagonLoader";

import contractAddress from "./utils/contractAddress";
import openSeaCollection from "./utils/openSeaCollection";

// Constants
const TWITTER_HANDLE = "aurelienb42";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mintState, setMintState] = useState("IDLE"); // can be IDLE, MINTING, MINTED
  const [mintedNFT, setMintedNFT] = useState(null);
  const [lastTransactions, setLastTransactions] = useState([]);

  const { setAlert } = useContext(alertContext);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Metamask is required to connect to this Web3 website");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Authorized account: ", accounts[0]);
      setCurrentAccount(account);

      setupEventListener();
    } else {
      console.error("Could not find an authorized account");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Metamask is required to connect to this Web3 website");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);

      setupEventListener();
    } catch (e) {
      console.error(e);
    }
  };

  const setupEventListener = async () => {
    try {
      const connectedContract = getConnectedContract(contractAddress);

      if (connectedContract) {
        connectedContract.on("NewEpicNFTMinted", (from, tokenId, mintCap) => {
          if (from.toLowerCase() != currentAccount.toLowerCase()) return; //this event hasn't been triggered by the logged in user
          const id = tokenId.toNumber();

          setMintedNFT({
            openseaLink: `https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`,
            id,
            mintCap,
          });
          setMintState("MINTED");
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const askContractToMintNft = async () => {
    if (!(await isAccountConnectedOnRinkeby())) {
      setAlert(
        "warning",
        "You need to connect on the Rinkeby testnet to buy these NFTs"
      );
      return;
    }

    try {
      const connectedContract = getConnectedContract(contractAddress);

      if (connectedContract) {
        console.log(connectedContract);

        let nftTxn = await connectedContract.makeAnEpicNFT();

        setMintState("MINTING");
        await nftTxn.wait();

        setLastTransactions([...lastTransactions, nftTxn.hash]);
      }
    } catch (e) {
      setAlert("danger", e.message);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderConnected = () => {
    switch (mintState) {
      case "IDLE":
        return (
          <button
            onClick={askContractToMintNft}
            className="cta-button connect-wallet-button"
          >
            MINT !
          </button>
        );

      case "MINTING":
        return (
          <>
            <h3> Your NFT is getting mined... </h3>
            <div style={{ position: "relative" }}>
              <HexagonLoader />
            </div>
          </>
        );

      case "MINTED":
        return (
          <div className="minted-nft-container">
            <h2>
              Congratulations, you just minted NFT{" "}
              <span className="gradient-text mint-count">
                #{mintedNFT.id + 1}
              </span>
            </h2>
            <p>
              Only{" "}
              <span className="gradient-text mint-count">
                {mintedNFT.mintCap - (mintedNFT.id + 1)}
              </span>{" "}
              NFTs are remaining, good job for getting yours!
            </p>
            <div className="actions">
              <a
                href={mintedNFT.openseaLink}
                target="_blank"
                rel="noreferrer"
                className="button opensea-button"
              >
                View your NFT on OpenSea
              </a>
              <a
                href={`https://rinkeby.etherscan.io/tx/${
                  lastTransactions[lastTransactions.length - 1]
                }`}
                target="_blank"
                rel="noreferrer"
                className="button transaction-button"
              >
                View transaction
              </a>
              <button
                onClick={() => {
                  setMintState("IDLE");
                }}
                className="button back-to-main-view-button"
              >
                Back to main view
              </button>
            </div>
          </div>
        );

      default:
        return <h1> Woops, this is not expected! </h1>;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Three words NFT</p>
          <p className="sub-text">Get a unique combination of three words.</p>
          <a
            href={openSeaCollection}
            className="collection-link"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            Check out the full collection!{" "}
          </a>
        </div>
        {!currentAccount ? renderNotConnectedContainer() : renderConnected()}
        <div className="last-transactions">
          <h4>Your last transactions</h4>
          {lastTransactions.length > 0 ? (
            lastTransactions.map((txn) => (
              <a key={txn} href={`https://rinkeby.etherscan.io/tx/${txn}`}> {txn} </a>
            ))
          ) : (
            <span>(none)</span>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Made by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
