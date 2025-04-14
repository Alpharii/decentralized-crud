// contracts/PeopleManager.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PeopleManager {
    struct Person {
        string name;
        uint age;
    }

    mapping(address => Person) private people;
    address[] private peopleList;

    mapping(address => bool) private isAdded;

    function addOrUpdatePerson(string memory _name, uint _age) external {
        if (!isAdded[msg.sender]) {
            peopleList.push(msg.sender);
            isAdded[msg.sender] = true;
        }
        people[msg.sender] = Person(_name, _age);
    }

    function getMyPerson() external view returns (string memory, uint) {
        Person memory p = people[msg.sender];
        return (p.name, p.age);
    }

    function getAllPeople() external view returns (address[] memory) {
        return peopleList;
    }

    function getPerson(address _addr) external view returns (string memory, uint) {
        Person memory p = people[_addr];
        return (p.name, p.age);
    }

    function deletePerson() external {
        delete people[msg.sender];
    }
}
