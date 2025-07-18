// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeMarkifyGovernanceToken is ERC20Votes, ERC20Permit, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    constructor()
        ERC20("DeMarkify Governance Token", "DMK-GOV")
        ERC20Permit("DeMarkify Governance Token")
        Ownable(msg.sender)
    {
        _mint(msg.sender, MAX_SUPPLY);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    // Required overrides for ERC20Votes
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(
        address account,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20Votes) {
        super._update(from, to, value);
    }
}
