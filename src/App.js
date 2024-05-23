import React, { Component } from "react";
import { QUESTIONS } from "./questions";

class App extends Component {
  state = {
    answers: {},
    score: null,
    averageScore: null,
  };

  async componentDidMount() {
    const totalScore = (await localStorage.getItem("totalScore")) || 0;
    const runs = (await localStorage.getItem("runs")) || 0;
    const averageScore = runs > 0 ? totalScore / runs : 0;

    this.setState({ averageScore });
  }

  handleAnswer = (questionId, answer) => {
    this.setState((prevState) => ({
      answers: { ...prevState.answers, [questionId]: answer },
    }));
  };

  calculateScore = async () => {
    const { answers } = this.state;
    const yesCount = Object.values(answers).filter((answer) => answer === "yes").length;
    const score = (100 * yesCount) / Object.keys(QUESTIONS).length;

    // Save score persistently
    const totalScore = (await localStorage.getItem("totalScore")) || 0;
    const runs = (await localStorage.getItem("runs")) || 0;

    await localStorage.setItem("totalScore", totalScore + score);
    await localStorage.setItem("runs", runs + 1);

    this.setState({ score });
    this.componentDidMount();
  };

  render() {
    const { answers, score, averageScore } = this.state;

    return (
      <div className="main__wrap">
        <main className="container">
          <div>
            {Object.entries(QUESTIONS).map(([id, question]) => (
              <div key={id}>
                <p>{id}. {question}</p>
                <button onClick={() => this.handleAnswer(id, "yes")} style={{ backgroundColor: answers[id] === "yes" ? "green" : "" }}>Yes</button>
                <button onClick={() => this.handleAnswer(id, "no")} style={{ backgroundColor: answers[id] === "no" ? "red" : "" }}>No</button>
              </div>
            ))}
          </div>
          <div>
            <button onClick={this.calculateScore}>Submit</button>
          </div>
          {score !== null && (
            <div>
              <p>Your score: {score}</p>
              <p>Average score: {averageScore}</p>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default App;
