
function Login({ onLogIn }) {
    const [username, setusername] = React.useState("")
    const [password, setpassword] = React.useState("")
    const onSubmit = (e)=>{
        e.preventDefault()
        onLogIn(username,password)
    }

    console.log("rendering Login")
    //debugger
    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2 style={{textAlign: "center"}}>Log In</h2>
                <form onSubmit={onSubmit}>
                    <div className="input-field row mb-3">
                    <div className="col-md-3"><label className="col-form-label" htmlFor="email">E-Mail</label></div>
                    <div className="col-md-9"><input id="email" type="text" className="form-control validate" onChange={ (e)=> setusername(e.target.value)} /></div>
                        
                    </div>
                    <div className="input-field row">
                        <div className="col-md-3"><label className="col-form-label" htmlFor="password">Password</label></div>
                        <div className="col-md-9"><input id="password" type="password" className="form-control validate" onChange={ (e)=> setpassword(e.target.value)}/></div>
                        
                    </div>
                    <div className="input-field submit-group" >
                        <input id="login_submit" type="submit" value="Log In" className="bg-primary text-white waves-effect waves-light btn" style={{width:"100%"}}/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
