import { useState } from "react";
import { useContract } from "../hooks/useContract";

export default function Index() {
  const { address, person, allPeople, loading, addOrUpdatePerson, getMyPerson, getAllPeople, deletePerson } = useContract();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">(0);

  const handleAddOrUpdate = async () => {
    if (name && age !== "") {
      await addOrUpdatePerson(name, age);
      setName("");
      setAge(0);
    }
  };

  return (
    <div>
      <h1>Welcome, {address}</h1>

      {/* Form for adding or updating person */}
      <div>
        <h2>Add or Update Your Info</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <button onClick={handleAddOrUpdate} disabled={loading}>
          {loading ? "Processing..." : "Add/Update Info"}
        </button>
      </div>

      {/* Display my person data */}
      <div>
        <h2>Your Info</h2>
        {person ? (
          <div>
            <p>Name: {person.name}</p>
            <p>Age: {person.age}</p>
          </div>
        ) : (
          <p>No info found. Please add your details.</p>
        )}
        <button onClick={getMyPerson} disabled={loading}>
          {loading ? "Loading..." : "Get My Info"}
        </button>
      </div>

      {/* Display all people */}
      <div>
        <h2>All People</h2>
        <button onClick={getAllPeople} disabled={loading}>
          {loading ? "Loading..." : "Get All People"}
        </button>
        <ul>
          {allPeople.map((personAddress, index) => (
            <li key={index}>
              <a href={`#`} onClick={() => getContractPerson(personAddress)}>
                Person {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete my person */}
      <div>
        <h2>Delete My Info</h2>
        <button onClick={deletePerson} disabled={loading}>
          {loading ? "Processing..." : "Delete My Info"}
        </button>
      </div>
    </div>
  );

  // Function to get person info based on address
  async function getContractPerson(personAddress: string) {
    const personData = await getPerson(personAddress);
    if (personData) {
      alert(`Name: ${personData.name}, Age: ${personData.age}`);
    }
  }
}
