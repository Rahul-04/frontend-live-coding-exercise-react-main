import React, { Component } from "react";
import { QUESTIONS } from "./questions";

class App extends Component {
  state = {
    answers: {},
    currentScore: 0,
    averageScore: 0,
    totalRuns: 0,
  };

  componentDidMount() {
    // Retrieve total runs and average score from localStorage
    const totalRuns = parseInt(localStorage.getItem("totalRuns")) || 0;
    const totalScore = parseFloat(localStorage.getItem("totalScore")) || 0;
    const averageScore = totalRuns > 0 ? totalScore / totalRuns : 0;

    this.setState({ totalRuns, averageScore });
  }

  handleAnswerChange = (questionId, answer) => {
    this.setState((prevState) => ({
      answers: { ...prevState.answers, [questionId]: answer },
    }));
  };

  handleSubmit = () => {
    const { answers } = this.state;
    const yesCount = Object.values(answers).filter(
      (ans) => ans === "Yes"
    ).length;
    const score = (100 * yesCount) / Object.keys(QUESTIONS).length;

    // Update localStorage
    const totalRuns = parseInt(localStorage.getItem("totalRuns")) || 0;
    const totalScore = parseFloat(localStorage.getItem("totalScore")) || 0;
    const newTotalRuns = totalRuns + 1;
    const newTotalScore = totalScore + score;
    const averageScore = newTotalScore / newTotalRuns;

    localStorage.setItem("totalRuns", newTotalRuns);
    localStorage.setItem("totalScore", newTotalScore);

    // Reset the state for a new run and show scores
    this.setState({
      currentScore: score,
      averageScore,
      totalRuns: newTotalRuns,
    });
  };

  render() {
    const { answers, currentScore, averageScore, totalRuns } = this.state;

    return (
      <div className="main__wrap">
        <main className="container">
          <div>
            {Object.entries(QUESTIONS).map(([id, question]) => (
              <div key={id}>
                <h4>
                  Question {id}: {question}
                </h4>
                <label>
                  <input
                    type="radio"
                    name={`question-${id}`}
                    value="Yes"
                    checked={answers[id] === "Yes"}
                    onChange={() => this.handleAnswerChange(id, "Yes")}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question-${id}`}
                    value="No"
                    checked={answers[id] === "No"}
                    onChange={() => this.handleAnswerChange(id, "No")}
                  />
                  No
                </label>
              </div>
            ))}
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
          {totalRuns > 0 && (
            <div>
              <h3>Current Run Score: {currentScore.toFixed(2)}</h3>
              <h3>
                Average Score after {totalRuns} runs: {averageScore.toFixed(2)}
              </h3>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default App;
