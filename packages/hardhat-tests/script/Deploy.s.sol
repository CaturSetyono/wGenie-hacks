// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {WalletGenieTreasury} from "../contracts/WalletGenieTreasury.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        WalletGenieTreasury treasury = new WalletGenieTreasury(deployer, deployer);

        vm.stopBroadcast();

        console.log("=== WalletGenieTreasury Deployed ===");
        console.log("Network:    Mantle Sepolia");
        console.log("Chain ID:   5003");
        console.log("Treasury:", address(treasury));
        console.log("Owner:   ", deployer);
        console.log("Manager: ", deployer);
    }
}
