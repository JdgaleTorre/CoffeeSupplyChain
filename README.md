## Coffee Supply Chained

To Create this proyect I used the truffle box with React. [box](https://www.trufflesuite.com/boxes/react).

```
---- Rinkeby Network
Contract: 0xeD3fc69de1ddc5052FD338a2Cf6B270765781b44
Transaction Hash: 0x4ceb8fb6f87ff83f750b511270bb934b655480b4e0631084eb88ba097bada2e4
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Please make sure you've already installed Truffe and enabled MetaMask extension in your browser.

```
- Truffle v5.4.3
- Solidity>=0.4.21 <0.7.0
- web3 1.2.2
- node v14.16.0
```

**Why these library**
Because I couldn't run the boilerplate of the project, I decided to start with a Truffle Box with react.
This Box needs a more actual Truffle version. Therefore I choose to actualize all the libraries to a more new version.
So with Truffe v5.4.3, I could use Solidity between 0.4.21 and 0.7.0, with this I think the project would be more like a real-world project.
To better control the Ethereum provider, I used Web 3 v1.2.2.
And Node v14.16.0, its the version of Node that I used daily.


### Installing

A step by step series of examples that tell you have to get a development env running

Clone this repository:

```
git clone git@github.com:JdgaleTorre/CoffeeSupplyChain.git
```

Change directory to `client` folder and install all requisite npm packages (as listed in `package.json`):

```
cd client
npm install
```

Launch Truffle:

```
truffle develop
```

Your terminal should look something like this:

![truffle develop](images/truffleDevelop.png)

Compile smart contracts on other terminal:

```
truffle compile
```

This will create the smart contract artifacts in folder `client\src\contracts`.

Migrate smart contracts to the locally running blockchain, truffle on other terminal:

```
truffle migrate --network develop
```

Test smart contracts:

```
truffle test
```

In a separate terminal window, launch the DApp:

```
cd client
npm start
```

## UML files

## Activity - [drawio](./UML/Activity.drawio) - [PNG](./UML/Activity.png)

![Activity](./UML/Activity.png)

## Sequence - [drawio](./UML/Sequence.drawio) - [PNG](./UML/Sequence.png)

![Sequence](./UML/Sequence.png)

## State - [drawio](./UML/State.drawio) - [PNG](./UML/State.png)

![Sequence](./UML/State.png)

## Class (Data Model) - [drawio](./UML/Class.drawio) - [PNG](./UML/Class.png)

![Sequence](./UML/Class.png)

## Test Mnemonic

Mnemonic: worth elegant detect caution sustain scrub auto liar remain whip strategy cash
