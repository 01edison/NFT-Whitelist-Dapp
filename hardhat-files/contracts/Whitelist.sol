// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract WhiteList {
    // max number of addresses which can be whitelisted
    uint8 public maxWhitelistedAddresses;

    // keep track of number of addresses whitelisted till now
    uint8 public numAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _maxWhiteListedAddresses) {
        maxWhitelistedAddresses = _maxWhiteListedAddresses;
    }

    function addAddressToWhiteList() public {
        require(!whitelistedAddresses[msg.sender], "Sender is already whitelisted!");
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "Max Limit reached!");

        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
