import { ethers } from 'ethers';

import MyEpicNFTABI from './MyEpicNFT.json';

export const getConnectedContract = (contractAddress) => {
  const { ethereum } = window;

  if (!ethereum) {
    console.error(
      "Could not get connected contract: ethereum object does not exist!"
    );
    return null;
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, MyEpicNFTABI.abi, signer);
};

const rinkeByChain = '0x4';

export const isAccountConnectedOnRinkeby = async () => {
  const { ethereum } = window;

  if (ethereum) {
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    return chainId === rinkeByChain}

  return false;
}
