import React, { Component } from 'react'
import classes from './Quiz.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import axios from '../../axios/axios-quiz'
import Loader from '../../components/Ui/Loader/Loader'

class Quiz extends Component {
    state = {
        results: {},
        isFinished: false,
        activeQuesion: 0,
        answerState: null,
        quiz: [],
        loading: true,
    }

    onAnswerClickHandler = answerId => {
        if (this.state.answerState) {
            const key = Object.keys(this.state.answerState)[0]
            if (this.state.answerState[key] === 'success') {
                return
            }
        }
        const question = this.state.quiz[this.state.activeQuesion]
        const results = this.state.results
        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }
            this.setState({
                answerState: { [answerId]: 'success' },
                results,
            })
        } else {
            results[question.id] = 'error'
            this.setState({
                answerState: { [answerId]: 'error' },
                results,
            })
        }
        const timeout = window.setTimeout(() => {
            if (this.isQuizFinished()) {
                this.setState({ isFinished: true })
            } else {
                this.setState({
                    activeQuesion: this.state.activeQuesion + 1,
                    answerState: null,
                })
            }
            window.clearTimeout(timeout)
        }, 300)
    }

    isQuizFinished() {
        return this.state.activeQuesion + 1 === this.state.quiz.length
    }

    retryHandler = () => {
        this.setState({
            activeQuesion: 0,
            answerState: null,
            isFinished: false,
            results: {},
        })
    }

    async componentDidMount() {
        try {
            const response = await axios.get(`/quizes/${this.props.match.params.id}.json`)
            const quiz = response.data

            this.setState({
                quiz,
                loading:false,
            })
        } catch (e) {
            console.log(e)
        }
        
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Ответьте на все вопросы</h1>

                        {
                            this.state.loading
                            ? <Loader/>
                            : this.state.isFinished 
                                ? <FinishedQuiz
                                    results={this.state.results}
                                    quiz={this.state.quiz}
                                    onRetry={this.retryHandler}
                                />   
                                : <ActiveQuiz
                                    answers={this.state.quiz[this.state.activeQuesion].answers}
                                    question={this.state.quiz[this.state.activeQuesion].question}
                                    onAnswerClick={this.onAnswerClickHandler}
                                    quizLength={this.state.quiz.length}
                                    answerNumber={this.state.activeQuesion + 1}
                                    state={this.state.answerState}
                                />    
                        }           
                            

                </div>
            </div>
        )
    }
}

export default Quiz
