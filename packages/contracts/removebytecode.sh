#!/bin/sh
for i in abi/*;
    do jq 'del(.bytecode) | del(.deployedBytecode) | del(.ast)' \"$i\" > \"$i\".tmp && mv \"$i\".tmp \"$i\";
done;
