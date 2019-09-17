import axios from 'axios'

export default axios.create({
    baseURL: 'https://react-quiz-36b0c.firebaseio.com/'
})