import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  username = event => {
    this.setState({username: event.target.value})
  }

  password = event => {
    this.setState({password: event.target.value})
  }

  successOutput = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  failureOutput = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const Details = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(Details),
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      this.successOutput(data.jwt_token)
    } else {
      this.failureOutput(data.error_msg)
    }
  }

  render() {
    const {showError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="form-logo"
          />

          <p style={{color: 'white'}}>USERNAME</p>
          <input
            type="text"
            placeholder="username"
            className="text-input"
            onChange={this.username}
          />
          <p style={{color: 'white', marginTop: '14px'}}>PASSWORD</p>
          <input
            type="password"
            placeholder="Password"
            className="password-input "
            onChange={this.password}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {showError && <p style={{color: 'red'}}>*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
