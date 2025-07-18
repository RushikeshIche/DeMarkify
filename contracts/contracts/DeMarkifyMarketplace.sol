// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeMarkifyMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        address paymentToken;
        bool isActive;
    }

    uint256 public listingCount; // Using simple counter instead of Counters
    mapping(uint256 => Listing) public listings;
    address public feeRecipient;
    uint256 public platformFee;

    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 price,
        address paymentToken
    );

    event Purchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount,
        uint256 totalPrice
    );

    constructor(address _feeRecipient, uint256 _platformFee) {
        feeRecipient = _feeRecipient;
        platformFee = _platformFee;
        listingCount = 0;
    }

    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address paymentToken
    ) external nonReentrant returns (uint256) {
        IERC1155(nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );

        listingCount++;
        listings[listingCount] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            amount: amount,
            price: price,
            paymentToken: paymentToken,
            isActive: true
        });

        emit Listed(
            listingCount,
            msg.sender,
            tokenId,
            amount,
            price,
            paymentToken
        );
        return listingCount;
    }
}
