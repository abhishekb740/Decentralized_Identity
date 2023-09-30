// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Decentralized_Identity{
    struct DIDRegistry{
        address owner;
        string did;
    }
    
    mapping(address => DIDRegistry) public RegisteredDID;

    function RegisterDID(string calldata _publicKey) external {
        require(RegisteredDID[msg.sender].owner == address(0), "DID Already Registered!");
        RegisteredDID[msg.sender] = DIDRegistry({
            owner: msg.sender,
            did: _publicKey
        });
    }

    function checkIfRegistered() external view returns(bool){
        if(RegisteredDID[msg.sender].owner == address(0)){
            return false;
        }
        return true;
    }
}