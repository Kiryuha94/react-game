import React, { Component } from 'react';
import Field from 'components/Field';
import Button from 'components/Button';
import Loader from 'react-loader-spinner';
import Footer from 'components/Footer';
import Supplmented from 'components/Supplemented';

class Main extends Component {
  XO = {
    x: 'X',
    o: 'O',
  };

  winnerCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  constructor(props) {
    super(props);

    const maybeState = localStorage.getItem('state');
    if (maybeState) {
      const state = JSON.parse(maybeState);
      this.state = state;
    } else {
      this.state = {
        isTwoPlayer: null,
        firstPlayerWins: 0,
        secondPlayerWins: 0,
        field: new Array(9).fill(null),
        isNextMove: false,
        count: 0,
        isWin: false,
        isPlay: false,
        isFirstPlayerStarted: true,
        win: '',
        visible: false,
        showButtonNextRound: false,
        showSetting: false,
        backgroundColor: '',
        cellBackgroundColor: '',
        zoom: '',
        isAutoPlay: false,
        isAudioActive: true,
      };
    }

    this.urlX = 'media/audio/x.mp3';
    this.urlO = 'media/audio/o.mp3';
    this.urlWin = 'media/audio/win.mp3';
    this.audioX = new Audio(this.urlX);
    this.audioO = new Audio(this.urlO);
    this.audioWin = new Audio(this.urlWin);

    window.onbeforeunload = () => {
      localStorage.setItem('state', JSON.stringify(this.state));
    };
    const { count, isFirstPlayerStarted, isTwoPlayer } = this.state;
    const isEvenMove = !(count % 2);
    const isFirstPlayerMove = isFirstPlayerStarted ? isEvenMove : !isEvenMove;
    if (!isTwoPlayer && !isFirstPlayerMove) {
      this.boteMove();
    }
  }

  componentDidMount() {
    this.onClose(this.state);
    this.addSettings(this.state);
  }
  onCellClick = (i, isBot = false) => {
    const { isAudioActive, count, field, isNextMove, isFirstPlayerStarted, isTwoPlayer, isAutoPlay } = this.state;

    const isEvenMove = !(count % 2);
    const isFirstPlayerMove = isFirstPlayerStarted ? !isEvenMove : isEvenMove;
    if (field[i] !== null || (!isNextMove && !isBot)) return;

    field[i] = count % 2 ? this.XO.o : this.XO.x;
    if (isAudioActive) count % 2 ? this.audioO.play() : this.audioX.play();

    this.setState({
      field: [].concat(field),
      count: count + 1,
    });

    if (this.checkCombination(field)) {
      this.onWin(count);
      return;
    }

    if (field.every((v) => v !== null)) {
      this.onDraw();
      return;
    }

    if (!isTwoPlayer && !isFirstPlayerMove) {
      this.boteMove();
    }

    if (isAutoPlay) {
      const isEvenMove = !(count % 2);
      const isFirstPlayerMove = isFirstPlayerStarted ? isEvenMove : !isEvenMove;
      if (!isFirstPlayerMove) {
        this.autoplay();
      }
    }
  };

  checkCombination = (field) => {
    for (const comb of this.winnerCombination) {
      const [a, b, c] = comb;

      if (field[a] && field[a] === field[b] && field[a] === field[c]) {
        return true;
      }
    }
    return false;
  };

  onDraw = () => {
    const { isAutoPlay } = this.state;
    this.setState({
      isAutoPlay: false,
      showButtonNextRound: true,
      isPlay: false,
      isNextMove: false,
      isWin: true,
      win: 'Draw!',
    });
    if (!isAutoPlay) {
      this.setState({ showButtonNextRound: false });
    }
  };

  hendlerSingle = () => {
    this.setState({
      field: Array(9).fill(null),
      isTwoPlayer: false,
      isPlay: true,
      isNextMove: true,
      count: 0,
      isWin: false,
      firstPlayerWins: 0,
      secondPlayerWins: 0,
    });
  };

  boteMove = () => {
    this.setState({ isNextMove: false, visible: true });
    setTimeout(() => {
      this.setState({ isNextMove: true, visible: false });
      this.onCellClick(this.getIndexForBotMove(), true);
    }, 2000);
  };

  autoplay = () => {
    const { isWin, isAutoPlay, showButtonNextRound } = this.state;
    this.setState({ isNextMove: false, visible: true, isAutoPlay: true, isWin: false });
    setTimeout(() => {
      this.setState({ visible: false, isAutoPlay: true });
      this.onCellClick(this.getIndexForBotMove(), true);
    }, 2000);
    if (isWin) this.setState({ field: new Array(9).fill(null), count: 0 });
  };

  getIndexForBotMove = () => {
    const { field, isFirstPlayerStarted } = this.state;

    const lines = this.winnerCombination.map((comb) => {
      return comb.map((index) => ({ index, value: field[index] }));
    });

    const check = (symbol) => {
      for (const line of lines) {
        if (line[0].value === symbol && line[1].value === symbol && line[2].value === null) {
          return line[2].index;
        }
        if (line[0].value === symbol && line[2].value === symbol && line[1].value === null) {
          return line[1].index;
        }
        if (line[1].value === symbol && line[2].value === symbol && line[0].value === null) {
          return line[0].index;
        }
      }
    };

    const winIndex = check(isFirstPlayerStarted ? this.XO.o : this.XO.x);
    if (winIndex) {
      return winIndex;
    }

    const blockIndex = check(isFirstPlayerStarted ? this.XO.x : this.XO.o);
    if (blockIndex) {
      return blockIndex;
    }

    const indexArr = field.reduce((acc, v, i) => (v === null ? [...acc, i] : acc), []);
    return indexArr[Math.floor(Math.random() * indexArr.length)];
  };

  handlerTwoPerson = () => {
    this.setState({
      field: Array(9).fill(null),
      isTwoPlayer: true,
      isPlay: true,
      count: 0,
      isNextMove: true,
      isWin: false,
      firstPlayerWins: 0,
      secondPlayerWins: 0,
    });
  };

  onWin = (count) => {
    const {
      isAutoPlay,
      isWin,
      firstPlayerWins,
      secondPlayerWins,
      isFirstPlayerStarted,
      win,
      showButtonNextRound,
      isAudioActive,
    } = this.state;
    if (isAudioActive) this.audioWin.play();
    let isFirstPlayerWin;
    const isEvenMove = !(count % 2);

    if (isFirstPlayerStarted) {
      isFirstPlayerWin = isEvenMove;
    } else {
      isFirstPlayerWin = !isEvenMove;
    }

    this.setState({
      isAutoPlay: false,
      showButtonNextRound: true,
      isWin: true,
      isPlay: false,
      isNextMove: false,
      firstPlayerWins: isFirstPlayerWin ? firstPlayerWins + 1 : firstPlayerWins,
      secondPlayerWins: isFirstPlayerWin ? secondPlayerWins : secondPlayerWins + 1,
      win: `${isFirstPlayerWin ? 'First player WINS' : 'Second player WINS'}`,
    });
    if (isAutoPlay) {
      this.setState({ showButtonNextRound: false });
    }
  };

  nextRaund = () => {
    const { isFirstPlayerStarted, isTwoPlayer, count, showButtonNextRound } = this.state;
    this.setState({
      showButtonNextRound: false,
      field: Array(9).fill(null),
      isNextMove: true,
      isPlay: true,
      count: 0,
      isWin: false,
      isFirstPlayerStarted: !isFirstPlayerStarted,
    });

    if (!isTwoPlayer && isFirstPlayerStarted) {
      this.boteMove();
    }
  };

  onClose = (settings) => {
    this.setState({ ...settings, showSetting: false });
  };

  onCLickOk = (settings) => {
    this.setState({ ...settings, showSetting: false });
    this.addSettings(settings);
  };
  addSettings = ({ backgroundColor, zoom, stateAudio }) => {
    const root = document.getElementById('root');
    const htmlEl = document.querySelector('html');
    root.style.background = backgroundColor;
    htmlEl.style.fontSize = `${zoom}px`;
    this.setState({ isAudioActive: stateAudio });
  };

  showSetting = () => {
    this.setState({ showSetting: true });
  };

  reset = () => {
    this.setState(
      {
        isTwoPlayer: null,
        firstPlayerWins: 0,
        secondPlayerWins: 0,
        field: new Array(9).fill(null),
        isNextMove: false,
        count: 0,
        isWin: false,
        isPlay: false,
        isFirstPlayerStarted: true,
        visible: false,
        showButtonNextRound: false,
        showSetting: false,
        backgroundColor: '#8bccd8',
        cellBackgroundColor: '',
        zoom: 10,
        isAutoPlay: false,
        isAudioActive: true,
      },
      () => {
        this.addSettings(this.state);
      }
    );
  };

  render() {
    const {
      isAutoPlay,
      isPlay,
      firstPlayerWins,
      secondPlayerWins,
      visible,
      isWin,
      showButtonNextRound,
      count,
      isFirstPlayerStarted,
      isTwoPlayer,
      showSetting,
      backgroundColor,
      cellBackgroundColor,
      zoom,
      stateAudio,
    } = this.state;
    const isEvenMove = !(count % 2);
    const isFirstPlayerMove = isFirstPlayerStarted ? isEvenMove : !isEvenMove;
    return (
      <>
        {showSetting && (
          <div className="settings">
            <Supplmented
              onClose={this.onClose}
              onClickOk={this.onCLickOk}
              cellBackgroundColor={cellBackgroundColor}
              zoom={zoom}
              backgroundColor={backgroundColor}
              stateAudio={stateAudio}
            />
          </div>
        )}
        {isWin && <img className="icubovich" src="media/Icubovich.png" alt="Icubovich" />}
        <h1>Tic Tac Toe</h1>
        {!isPlay && (
          <div>
            <Button onClick={this.showSetting} title="Setting designe" />
            <Button className="autoplay" onClick={this.autoplay} title="Autoplay" />
          </div>
        )}
        {!isPlay && (
          <Button
            className={`${isTwoPlayer ? 'button-active' : ''}`}
            onClick={this.handlerTwoPerson}
            title="Play for 2 persons"
          />
        )}
        {!isPlay && (
          <Button
            className={`${isTwoPlayer === false ? 'button-active' : ''}`}
            onClick={this.hendlerSingle}
            title="Single play"
          />
        )}
        <h2 className="score">
          Score:
          <label className={`${isFirstPlayerMove ? 'player-active' : ''}`}>{`Player: ${firstPlayerWins}`}</label>
          <label className={`${isFirstPlayerMove ? '' : 'player-active'}`}>{`Player 2: ${secondPlayerWins}`}</label>
        </h2>
        {isWin && <p className="draw">{this.state.win}</p>}
        <div className={!visible ? 'hidden' : ''}>
          <Loader type="ThreeDots" color="yellow" height={20} width={50} />
        </div>
        <Field onCellClick={this.onCellClick} field={this.state.field} cellColor={cellBackgroundColor} />
        {showButtonNextRound && <Button onClick={this.nextRaund} title="Next round!" />}
        {!isAutoPlay && <Button onClick={this.reset} title="reset" />}
        <Footer />
      </>
    );
  }
}

export default Main;
