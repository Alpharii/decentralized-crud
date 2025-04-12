import { ethers } from "ethers";
import { useEffect, useState } from "react";

export function useEthers() {
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [signer, setSigner] = useState<ethers.Signer>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    const init = async () => {
      if ((window as any).ethereum) {
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const addr = await signer.getAddress();

        setProvider(browserProvider);
        setSigner(signer);
        setAddress(addr);
      } else {
        console.warn("MetaMask not detected");
      }
    };

    init();
  }, []);

  return { provider, signer, address };
}
