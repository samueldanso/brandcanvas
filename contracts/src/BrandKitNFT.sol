// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title BrandKitNFT
/// @notice ERC-721 representing AI-generated brand assets with on-chain provenance.
/// @dev Minted by the BrandCanvas backend to the x402 payer's address.
contract BrandKitNFT is ERC721, Ownable {
    using Strings for uint256;
    using Strings for address;

    // ─── Errors ────────────────────────────────────────────────────────
    error NotMinter();
    error TokenDoesNotExist();

    // ─── Events ────────────────────────────────────────────────────────
    event BrandKitMinted(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 indexed contentHash,
        string kitType
    );

    // ─── Storage ───────────────────────────────────────────────────────
    struct BrandKit {
        bytes32 contentHash;
        string kitType;
        uint256 timestamp;
    }

    mapping(uint256 => BrandKit) private _kits;
    uint256 private _nextTokenId;
    address public minter;

    // ─── Constructor ───────────────────────────────────────────────────
    constructor(address initialOwner, address initialMinter)
        ERC721("BrandCanvas IP", "BCIP")
        Ownable(initialOwner)
    {
        minter = initialMinter;
    }

    // ─── Modifiers ─────────────────────────────────────────────────────
    modifier onlyMinter() {
        if (msg.sender != minter) revert NotMinter();
        _;
    }

    // ─── External ──────────────────────────────────────────────────────

    /// @notice Mint a brand kit NFT to the payer.
    /// @param to Address of the x402 payer who owns this brand kit.
    /// @param contentHash keccak256 hash of the generated brand kit JSON.
    /// @param kitType Type of brand kit: "palette", "fonts", "guidelines".
    /// @return tokenId The minted token ID.
    function mint(address to, bytes32 contentHash, string calldata kitType)
        external
        onlyMinter
        returns (uint256 tokenId)
    {
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _kits[tokenId] = BrandKit({
            contentHash: contentHash,
            kitType: kitType,
            timestamp: block.timestamp
        });
        emit BrandKitMinted(tokenId, to, contentHash, kitType);
    }

    /// @notice Update the authorized minter address.
    function setMinter(address newMinter) external onlyOwner {
        minter = newMinter;
    }

    // ─── View ──────────────────────────────────────────────────────────

    /// @notice Returns fully on-chain JSON metadata for a token.
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();

        BrandKit memory kit = _kits[tokenId];

        string memory json = string.concat(
            '{"name":"BrandCanvas #',
            tokenId.toString(),
            " - ",
            kit.kitType,
            '","description":"AI-generated brand asset with on-chain IP provenance. Created by BrandCanvas on X Layer.","attributes":[{"trait_type":"Kit Type","value":"',
            kit.kitType,
            '"},{"trait_type":"Content Hash","value":"',
            _bytes32ToHex(kit.contentHash),
            '"},{"trait_type":"Created","display_type":"date","value":',
            kit.timestamp.toString(),
            '}],"external_url":"https://brandcanvas.onrender.com"}'
        );

        return string.concat(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        );
    }

    /// @notice Get brand kit data for a token.
    function getBrandKit(uint256 tokenId) external view returns (BrandKit memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        return _kits[tokenId];
    }

    /// @notice Total minted tokens.
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // ─── Internal ──────────────────────────────────────────────────────

    function _bytes32ToHex(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(66); // "0x" + 64 hex chars
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 32; i++) {
            str[2 + i * 2] = alphabet[uint8(data[i] >> 4)];
            str[3 + i * 2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
}
