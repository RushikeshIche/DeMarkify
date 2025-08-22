// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        address buyer;
        bool sold;
    }

    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(
        IERC721 _nft,
        uint _tokenId,
        uint _price
    ) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");

        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            address(0),
            false
        );

        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        require(!item.sold, "Item already sold");

        uint totalPrice = getTotalPrice(_itemId);
        require(
            msg.value >= totalPrice,
            "Not enough ETH to cover item price and fee"
        );

        item.seller.transfer(item.price);
        feeAccount.transfer(totalPrice - item.price);
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        item.buyer = msg.sender;
        item.sold = true;

        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
    function resellItem(uint256 _itemId, uint256 _price) public nonReentrant {
        Item storage item = items[_itemId];
        require(item.buyer == msg.sender, "Only buyer can resell");
        require(_price > 0, "Price must be > 0");

        // Transfer NFT back to marketplace
        item.nft.transferFrom(msg.sender, address(this), item.tokenId);

        // Reset item details for resale
        item.seller = payable(msg.sender);
        item.buyer = address(0);
        item.price = _price;
        item.sold = false;

        emit Offered(
            _itemId,
            address(item.nft),
            item.tokenId,
            _price,
            msg.sender
        );
    }

    function getTotalPrice(uint _itemId) public view returns (uint) {
        Item storage item = items[_itemId];
        return item.price + ((item.price * feePercent) / 100);
    }
}
