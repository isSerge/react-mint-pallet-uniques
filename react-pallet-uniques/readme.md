# react-pallet-uniques
Minimal React app that can permanently store object on [Subspace Network](https://github.com/subspace/subspace) and interact with Substrate chains that utilize [pallet-uniques](https://crates.parity.io/pallet_uniques/index.html) for non-fungible tokens (Statemine, Statemint, Westmint, etc.)

## What is included
This app is built using following tools:
- [create-react-app](https://github.com/facebook/create-react-app)
- [@subspace/subspace](https://github.com/subspace/subspace.js)
- [@polkadot/api](https://github.com/polkadot-js/api)

## Quickstart
- specify Subspace node and Subspace farmer endpoints in `.env` file:
```
REACT_APP_NODE_WS_PROVIDER=ws://localhost:9944
REACT_APP_FARMER_WS_PROVIDER=ws://localhost:9955
```
- `npm install` or `yarn` to install dependencies
- `npm start` or `yarn start`
for more scripts - please, refer to Create React App [docs](https://create-react-app.dev/)
- Open `http://localhost:3000` in the browser
- App connects to Westmint node RPC endpoint by default, you can connect to any other Substrate-based chains by providing endpoint as `rpc` query parameter:
```
http://localhost:3000/?rpc=wss%3A%2F%2Fwestmint-rpc.polkadot.io
```

## Notes
- If you are connecting to local Substrate node,chain runtime should include [pallet-uniques](https://crates.parity.io/pallet_uniques/index.html)
- This app requires [Polkadot{.js} extension](https://polkadot.js.org/extension/) installed, as well as Subspace and target chain accounts with some funds to cover extrinsics fees
