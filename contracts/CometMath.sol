// SPDX-License-Identifier: XXX ADD VALID LICENSE
pragma solidity ^0.8.0;

/**
 * @title Compound's Comet Math Contract
 * @dev Pure math functions
 * @author Compound
 */
contract CometMath {
    function min(uint104 a, uint104 b) internal pure returns (uint104) {
        return a < b ? a : b;
    }

    function safe64(uint n) internal pure returns (uint64) {
        require(n <= type(uint64).max, "number exceeds size (64 bits)");
        return uint64(n);
    }

    function safe104(uint n) internal pure returns (uint104) {
        require(n <= type(uint104).max, "number exceeds size (104 bits)");
        return uint104(n);
    }

    function safe128(uint n) internal pure returns (uint128) {
        require(n <= type(uint128).max, "number exceeds size (128 bits)");
        return uint128(n);
    }

    function signed104(uint104 n) internal pure returns (int104) {
        require(n <= uint104(type(int104).max), "number exceeds max int size");
        return int104(n);
    }

    function unsigned104(int104 n) internal pure returns (uint104) {
        require(n >= 0, "number is negative");
        return uint104(n);
    }

    function toUInt8(bool x) internal pure returns (uint8) {
        return x ? 1 : 0;
    }

    function toBool(uint8 x) internal pure returns (bool) {
        return x != 0;
    }
}
