// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {BrandKitNFT} from "../src/BrandKitNFT.sol";

contract DeployBrandKitNFT is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address owner = vm.envAddress("OWNER_ADDRESS");
        address minter = vm.envAddress("MINTER_ADDRESS");

        vm.startBroadcast(deployerKey);
        BrandKitNFT nft = new BrandKitNFT(owner, minter);
        console.log("BrandKitNFT deployed to:", address(nft));
        console.log("Owner:", owner);
        console.log("Minter:", minter);
        vm.stopBroadcast();
    }
}
