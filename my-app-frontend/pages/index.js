import Head from "next/head";
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants/constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [numWhiteListed, setNumWhiteListed] = useState(0);
  const [joinedWhiteList, setJoinedWhiteList] = useState(false);
  const web3ModalRef = useRef();

  const getSignerOrProvider = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect(); //gives us metamask

    const web3Provider = new providers.Web3Provider(provider); // wraps it in a class so as to allow us actually manipulate metamask

    const { chainId } = await web3Provider.getNetwork(); //get the network that the provider(metamask) is connected to

    if (chainId !== 5) {
      alert("Change newtork to goerli!");
      throw new Error("Change newtork to goerli!");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer; //return a signer if needSigner is set to true
    }
    return web3Provider;
  };

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getSignerOrProvider(true); //returns the person who is currently connected to metamask

      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const signerAddress = await signer.getAddress(); //get the signers address
      const _joinedWhiteList = await whiteListContract.whitelistedAddresses(
        signerAddress
      ); // gets a boolean

      setJoinedWhiteList(_joinedWhiteList);
    } catch (error) {
      console.log(error);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getSignerOrProvider();

      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numWhiteListed = await whiteListContract.numAddressesWhitelisted();

      setNumWhiteListed(_numWhiteListed);
    } catch (error) {
      console.log(error);
    }
  };

  const joinWhiteList = async () => {
    try {
      const signer = await getSignerOrProvider(true);
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await whiteListContract.addAddressToWhiteList();

      await tx.wait(); // wait for the transaction to get mined

      await getNumberOfWhitelisted(); //get current number of whitelisted accounts

      setJoinedWhiteList(true);
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getSignerOrProvider();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhiteList) {
        return (
          <div className={styles.description}>
            Thanks for joining the whitelist!
          </div>
        );
      } else {
        return (
          <>
            <button className={styles.button} onClick={joinWhiteList}>
              Join Whitelist !
            </button>
          </>
        );
      }
    } else {
      return (
        <>
          <button className={styles.button} onClick={connectWallet}>
            Connect Your wallet
          </button>
        </>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    } else {
      console.log("We're connected already! duh");
    }
  });

  return (
    <>
      <Head>
        <title>Join WhiteList</title>
        <meta title="name" content="White-list dapp" />
      </Head>
      <section className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs</h1>
          <div className={styles.description}>
            {numWhiteListed} have already joined!
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </section>
      <footer className={styles.footer}>Made with &#10084; by edison!</footer>
    </>
  );
}
