// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract DeMarkify is ERC1155, Ownable, IERC2981 {
    using Strings for uint256;

    string public name;
    string public symbol;
    string public baseURI;
    uint256 public currentTokenId;

    struct Asset {
        address creator;
        uint256 royaltyPercentage;
        string licenseType;
        bool isVerified;
    }

    mapping(uint256 => Asset) public assets;

    event AssetMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string licenseType,
        uint256 royaltyPercentage,
        bool isVerified
    );

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) ERC1155(_baseURI) Ownable(msg.sender) {
        name = _name;
        symbol = _symbol;
        baseURI = _baseURI;
    }

    function mint(
        address to,
        uint256 amount,
        uint256 royaltyPercentage,
        string calldata licenseType,
        bool isVerified,
        bytes calldata data
    ) external onlyOwner returns (uint256) {
        currentTokenId++;
        assets[currentTokenId] = Asset({
            creator: msg.sender,
            royaltyPercentage: royaltyPercentage,
            licenseType: licenseType,
            isVerified: isVerified
        });

        _mint(to, currentTokenId, amount, data);
        emit AssetMinted(
            currentTokenId,
            msg.sender,
            licenseType,
            royaltyPercentage,
            isVerified
        );
        return currentTokenId;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        Asset memory asset = assets[tokenId];
        return (asset.creator, (salePrice * asset.royaltyPercentage) / 10000);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, IERC165) returns (bool) {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
