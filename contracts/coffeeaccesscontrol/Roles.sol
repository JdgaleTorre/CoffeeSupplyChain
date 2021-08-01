// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
  struct Role {
    mapping (address => bool) bearer;
  }

  /**
   * @dev give an account access to this role
   */
  function add(Role storage role, address account) internal {
    require(account != address(0), "Can't be added address 0 to any role.");
    require(!has(role, account), "Can't be added twice an account.");

    role.bearer[account] = true;
  }

  /**
   * @dev remove an account's access to this role
   */
  function remove(Role storage role, address account) internal {
    require(account != address(0), "Can't be removed address 0 from any role.");
    require(has(role, account), "Can't be remove an account that is not the role.");

    role.bearer[account] = false;
  }

  /**
   * @dev check if an account has this role
   * @return bool
   */
  function has(Role storage role, address account)
    internal
    view
    returns (bool)
  {
    require(account != address(0), "The address 0 can't be any role.");
    return role.bearer[account];
  }
}