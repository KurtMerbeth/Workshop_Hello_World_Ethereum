import React, { Component } from 'react';
import Web3 from 'web3';
import {CONTRACT_ABI, CONTRACT_ADDRESS} from './util/const'

class App extends Component {

  constructor() {
    super();
    this.state = {
      contract: '',
      someString: '',
      result: ''
    }
  }

  // initialisiert alle nötigen componenten für die blockchain kommunikation
  init = async () => {
      window.web3 = new Web3(window.ethereum)   // neue web3 instanz
      await window.ethereum.enable();           // aktiviert das metamask browser plugin
      await window.web3.eth.getAccounts((error, accounts) => {    // liest das erste wallet in metamask aus
        if (accounts.length === 0) {
          console.log("no active accounts");
          // there is no active accounts in MetaMask
        } else {
          // it's ok
          console.log("ok");
          this.setState({account: accounts[0], web3: window.web3}); // speichert wallet und web3 instanz im state
        }
      });
      this.setState({contract: await new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)}); // lädt contract informationen und speichert sie im state
   }

   // speichert eingabewert im state
   somestringHandler = (event) => {
    this.setState({someString: event.target.value})
  }

    // smart contract interaktion, methodenaufruf: setSomeString(..)
    // parameter wird aus dem state übergeben
  setSomestring = () => {
    this.state.contract.methods.setSomeString(this.state.someString).send({from: this.state.account})
  }

  // liest den String aus dem smart contract und speichert diesen im state
  getSomestring = () => {
    this.state.contract.methods.someString().call({from: this.state.account}).then((result)=> {
      this.setState({result: result})
    });
  }

  render() {
    return (
      <div className="App">
        <center>
        <br />
        <button onClick={this.init}> Connect with Metamask </button> 
        <br />
        <br />
        set Somestring: <p> <input type="text" name="string" onChange={this.somestringHandler} /> </p>
        <button onClick={this.setSomestring}> set </button> 
        <br />
        <br />
        <button onClick={this.getSomestring}> get </button> 
        <br />
        {this.state.result}
        </center>
      </div>
    );
  }
}

export default App;
