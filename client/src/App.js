import React, { Component } from "react";
import Registry from "./contracts/Registry.json";
import getWeb3 from "./utils/getWeb3";

import Pheme from '@pheme-kit/core';
import PhemeRegistry from '@pheme-kit/core/lib/registry';
import PhemeStorageIPFS from '@pheme-kit/storage-ipfs';


import * as ethers from 'ethers';

import "./App.css";


const IPFS_RPC = 'https://ipfs.infura.io:5001';
const IPFS_GATEWAY = 'https://ipfs.infura.io';

class App extends Component {
  state = { pheme: null, signerOrProvider: null, address: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const provider = await getWeb3();
      const network = await provider.getNetwork();

      const deployedNetwork = Registry.networks[network.chainId];
      const signerOrProvider = provider.getSigner() || provider;
      const contract = new ethers.Contract(deployedNetwork.address, Registry.abi, signerOrProvider);

      const registry = new PhemeRegistry(contract);
      const pheme = new Pheme(registry, {
        ipfs: new PhemeStorageIPFS(IPFS_RPC, IPFS_GATEWAY)
      });

      const address = await (signerOrProvider.getAddress && signerOrProvider.getAddress());

      this.setState({ pheme, signerOrProvider, address }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {;
    const { pheme, address } = this.state;
    const userHandle = await pheme.registry.getHandleByOwner(address).execute();
    console.log('user handle:', userHandle);
  };

  render() {
    if (!this.state.pheme) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>{this.state.address}</p>
        <button onClick={this.runExample}>RUN</button>
      </div>
    );
  }
}

export default App;
