import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players, balance});
  }

  onSubmit = async(event)=>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction to success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({message: 'Congratulations you have been entered in the lottery!'});

  }

  render() {
    // web3.eth.getAccounts().then(console.log);

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p> 

        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value} onChange={event=> this.setState({value: event.target.value})} />
          </div>
          <button>Enter</button>
        </form>

        <hr/>

        <h4>{this.state.message}</h4>

      </div>
    );
  }
}
export default App;
