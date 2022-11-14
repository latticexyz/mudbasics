# Mudbasics

A simple mud reference implementation

## Getting started
For a simple tutorial on how to use MUD, check out the slides of the [MUD workshop](https://www.figma.com/file/n4Ld4tpaiymotp9mRH5Te9/Mud-Workshop?node-id=0%3A1). Solutions for Quest 1 and Quest 2 can be found at [#1](https://github.com/latticexyz/mudbasics/pull/1) and [#2](https://github.com/latticexyz/mudbasics/pull/2).

## Pre-requisites

### On your machine

Install all of these:

1. NodeJS
1. Rust
1. Python 3
1. Yarn, the package manager (`npm install -g yarn`) - as of now, yarn is a mandatory requirement
1. Foundry, the Rust Ethereum framework - [https://getfoundry.sh/](https://getfoundry.sh/)

#### Windows-specific installation

(Yes, installing the Foundry is more annoying on Windows, but we are just getting started with the annoyances :))

1. Make sure you have a bash-based terminal to handle all of the scripts. Git-bash works perfectly but you can probably make with with WSL (although we haven't tested it).
1. If you use git-bash, you'll have to install the jq utility separately. Just run this in git-bash:
```
curl -L -o /usr/bin/jq.exe https://github.com/stedolan/jq/releases/latest/download/jq-win64.exe
```

### In your project

Setup a new workspace in your project. Keep your client and contracts code as separate workspaces.

Example project structure:
```
- my-project/
---- package.json
---- client/
---- contracts/
---- ...
```

Copy the contents of `packages/contracts` to `my-project/contracts`

#### Dependencies

Go to your contracts folder and install all dependencies:
```
yarn
```

#### Remapping

Open the `contracts/remapping.txt` file and edit the paths to point out to the node_modules folder containing 