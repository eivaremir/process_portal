

function Login({ onLogIn }) {
    const [username, setusername] = React.useState("")
    const [password, setpassword] = React.useState("")
    const onSubmit = (e)=>{
        e.preventDefault()
        onLogIn(username,password)
    }


    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2 style={{textAlign: "center"}}>Log In</h2>
                <form onSubmit={onSubmit}>
                    <div className="input-field col s6">
                        <input id="email" type="text" className="validate" onChange={ (e)=> setusername(e.target.value)} />
                        <label htmlFor="email">E-Mail</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="password" type="password" className="validate" onChange={ (e)=> setpassword(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="input-field submit-group" >
                        <input id="login_submit" type="submit" value="Log In" className="waves-effect waves-light btn" style={{width:"100%"}}/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
