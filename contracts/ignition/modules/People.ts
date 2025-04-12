// ignition/modules/People.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PeopleModule", (m) => {
  const people = m.contract("PeopleManager");
  return { people };
});
