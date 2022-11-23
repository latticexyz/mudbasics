// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { Perlin } from "noise/Perlin.sol";
import { ABDKMath64x64 as Math } from "abdk-libraries-solidity/ABDKMath64x64.sol";

contract PerlinTest is MudTest {
  function testExecute() public {
    // int128 perlin0 = Perlin.noise2d(44, 238, 20, 16);
    // console.logInt(perlin0);
    // console.logInt(Math.div(perlin0, 2**16));
    // // 34803 / 2**16 == 0,5310516357
    // //  0,5310516357 * 2**64 == 9796173614460960768
    // //  9796173614460960768 / 2**64 == 0,5310516357
    // console.logInt(Math.fromInt(30));
    // // = 553402322211286548480
    // // 553402322211286548480 / 2**64 = 30
    // console.logInt(Math.mul(553402322211286548480, 9796173614460960768));
    // console.logInt(Math.toInt(293885208433828823040));

    // Scale resource allocation by perlin noise value
    int32 x = 44;
    int32 y = 238;
    int128 perlin = Perlin.noise2d(x, y, 20, 16);
    int128 p = Math.div(perlin, 2 ** 16);
    int128 maxResource = Math.fromInt(15);
    int64 result = Math.toInt(Math.mul(maxResource, p));
    console.logInt(result);
  }
}
