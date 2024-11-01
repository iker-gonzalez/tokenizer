// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Token is ERC20, AccessControl {
    address private _owner;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _mint(msg.sender, initialSupply);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Token: must have minter role to mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        require(hasRole(BURNER_ROLE, msg.sender), "Token: must have burner role to burn");
        _burn(from, amount);
    }

    function grantMinterRole(address account) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Token: must have admin role to grant minter role");
        _grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Token: must have admin role to revoke minter role");
        _revokeRole(MINTER_ROLE, account);
    }

    function grantBurnerRole(address account) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Token: must have admin role to grant burner role");
        _grantRole(BURNER_ROLE, account);
    }

    function revokeBurnerRole(address account) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Token: must have admin role to revoke burner role");
        _revokeRole(BURNER_ROLE, account);
    }
}