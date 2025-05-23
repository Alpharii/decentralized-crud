// hooks/useContract.ts
import { useMemo, useState } from "react";
import { ethers } from "ethers";
import { useEthers } from "./useEthers";
import PeopleAbi from "../abis/People.json";

const CONTRACT_ADDRESS = "0x6E30Dbe7ce5FA6e695C644482810f8752571806A";

export function useContract() {
  const { signer, address } = useEthers();
  const [person, setPerson] = useState<{ name: string; age: number } | null>(null);
  const [allPeople, setAllPeople] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const contract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, PeopleAbi, signer);
  }, [signer]);

  const addOrUpdatePerson = async (name: string, age: number) => {
    if (!contract) return;

    setLoading(true);
    try {
      const tx = await contract.addOrUpdatePerson(name, age);
      await tx.wait(); // Wait for the transaction to be mined
    } catch (err) {
      console.error("Error adding or updating person:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMyPerson = async () => {
    if (!contract || !address) return;
  
    setLoading(true);
    try {
      const [name, ageBN] = await contract.getMyPerson();
      setPerson({ name, age: Number(ageBN) }); 
    } catch (err) {
      console.error("Error fetching my person data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getPerson = async (addr: string) => {
    if (!contract) return;
  
    setLoading(true);
    try {
      const [name, ageBN] = await contract.getPerson(addr);
      const age = ageBN.toNumber?.() ?? Number(ageBN); // fallback aman
      console.log("Fetched person by address:", { name, age });
      return { name, age };
    } catch (err) {
      console.error("Error fetching person data:", err);
    } finally {
      setLoading(false);
    }
  };
   

  const getAllPeople = async () => {
    if (!contract) return;
  
    setLoading(true);
    try {
      const result: string[] = await contract.getAllPeople();
      console.log("All people addresses:", result);
      setAllPeople(result);
    } catch (err) {
      console.error("Error fetching all people:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const deletePerson = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const tx = await contract.deletePerson();
      await tx.wait(); // Wait for the transaction to be mined
    } catch (err) {
      console.error("Error deleting person:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    address,
    person,
    allPeople,
    loading,
    addOrUpdatePerson,
    getMyPerson,
    getAllPeople,
    getPerson,
    deletePerson,
  };
}
