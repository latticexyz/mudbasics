// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "solecs/Component.sol";

uint256 constant ID = uint256(keccak256("component.Stats"));

struct Stats {
  int32 traveled;
  int32 gathered;
  int32 burnt;
  int32 eaten;
  int32 played;
}

contract StatsComponent is Component {
  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](5);
    values = new LibTypes.SchemaValue[](5);

    keys[0] = "traveled";
    values[0] = LibTypes.SchemaValue.INT32;

    keys[1] = "gathered";
    values[1] = LibTypes.SchemaValue.INT32;

    keys[2] = "burnt";
    values[2] = LibTypes.SchemaValue.INT32;

    keys[3] = "eaten";
    values[3] = LibTypes.SchemaValue.INT32;

    keys[4] = "played";
    values[4] = LibTypes.SchemaValue.INT32;
  }

  function set(uint256 entity, Stats memory stats) public {
    set(entity, abi.encode(stats));
  }

  function getValue(uint256 entity) public view returns (Stats memory) {
    return abi.decode(getRawValue(entity), (Stats));
  }
}
