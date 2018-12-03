import React from 'react'
import ReactDOM from 'react-dom'
import { GoogleLogin } from 'react-google-login'
import config from '../../config'

const responseGoogle = (response) => {
  console.log(response)
}

ReactDOM.render(
  <GoogleLogin
    clientId={config.auth.oauth.clientID}
    buttonText='Login'
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  />,
  document.getElementById('googleButton')
)
