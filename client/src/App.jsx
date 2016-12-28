import React, {Component} from 'react';
import FlipCard from 'react-flipcard';

let dataArray = []
let newTotalPledges = []

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
      game: [],
      pledges: [],
      leaderboard: [
        {user: 'Homer',
         totalAmountOwed: 0
       },
       {user: 'Peter',
        totalAmountOwed: 0
       }
      ]
    }
  }

  get onSocketData()
  {
    return data => {
      dataArray.push(data)

      if(!this.state || !this.state.pledges) { return; }

      this.state.pledges.forEach((user) => {
        user.pledged.forEach((pledge) => {
          if(data.includes(pledge.pledge_event)){
            newTotalPledges = user.totalPledges.push(pledge.pledge_amount)
            pledge.occurance = pledge.occurance + 1;
            pledge.owes = pledge.occurance * pledge.pledge_amount
            this.setState({
              occurance : pledge.occurance
            });
            this.setState({
              owes : pledge.owes
            });
          }
        })
      })
      this.setState({
        totalPledges: newTotalPledges
      })
      this.setState({
        game : dataArray
      });
    };
  }

  componentDidMount() {
    fetch('/pledges')
      .then(response => response.json())
      .then(data => {
        this.setState(data);
        this.props.socket.on('game-event', this.onSocketData);
      })
  }

  componentWillUnmount() {
    this.props.socket.removeListener('game-event', this.onSocketData);
  }

  // Flip for Leaderboard and Pledges //
  // this in showBack and ShowFront are null

  showBack() {
    this.setState({
      isFlipped: true
    });
  }

  showFront() {
    this.setState({
      isFlipped: false
    });
  }

  handleOnFlip(flipped) {
    if (flipped) {
      // this.refs.backButton.getDOMNode().focus();
      ReactDOM.getDOMNode(this.refs.backButton).focus();
    }
  }


  render() {
    return (
      <div>

         <FlipCard
            disabled={true}
            flipped={this.state.isFlipped}
            onFlip={this.handleOnFlip}
          >
            <div className="front">
            <div className="leaderboard">
              <button type="button" onClick={this.showBack}>To Pledges</button>
                <h1>Leaderboard</h1>
                  <ul>
                    {this.state.pledges.map(total =>
                    <li> {total.username}, {total.totalPledges.reduce(function(a, b) {
                      return a + b;
                    }, 0)}
                    </li>
                    )}
                  </ul>
            </div>
            </div>

            <div className="back">
            <div className="pledges">
             <button type="button" ref="backButton" onClick={this.showFront}>To Leaderboard</button>
                <h1>Pledges</h1>
                  <ul>
                  {this.state && this.state.pledges && this.state.pledges.map(pledge =>
                    pledge.pledged.map(userPledge =>
                      <li>{pledge.username}: Event: {userPledge.pledge_event}, Amount: {userPledge.pledge_amount}, Occurance: {userPledge.occurance}, Owes: {userPledge.owes} </li>
                      )
                    )}
                  </ul>
              </div>
              </div>
          </FlipCard>

        <div>
         <div className="gameFeed">
          <h1>Game Feef</h1>
            <ul>
              {this.state && this.state.game && this.state.game.map(event =>
              <li> {event} </li>
              )}
            </ul>
         </div>
        </div>
      </div>
    );
  }
}
export default App;
