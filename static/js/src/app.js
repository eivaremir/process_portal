import Calculator from './components/Calculator.js'
//import Button from '/material-ui/core/Button';
import Sidenav from './components/Sidenav.js'
import Header from './components/Header/Header.js'

import Login from './components/Login/Login.js'


// ViewStats
import ViewStats from './components/SystemView/SystemView'
import SystemView from './components/SystemView/SystemView'

function App() {

   


    //const [sideNavOpen, setSideNavOpen] = React.useState(true);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [goto, setgoto] = useState(undefined)


    React.useEffect( () => {

        const getSession = async () => {
          const session = await fetchSession()
          setIsLoggedIn(session.authenticated)
          console.log("Logged in: "+isLoggedIn)
        }
    
        getSession()
    },[isLoggedIn])
    
    const fetchSession = async () => {
        const res = await fetch("/session")
        const data = await res.json()
        return data
    }
    const logOut = async () =>{
        const res = await fetch("/session/end")
        const data = await res.json()
        console.log(data)
        setIsLoggedIn(!data.status)
    }
    const onLogIn = async (username, password) =>{
        const res = await fetch("/session/start",{
            method: 'POST',
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        const data = await res.json()
        setIsLoggedIn(data.status)

        const urlParams = new URLSearchParams(window.location.search);
        try{
            return <ReactRouterDOM.Redirect to={urlParams.get("goto")} />
        }
        catch(ex){}
    }
    const openSlideNav = (e) =>{
        let slidenav = document.querySelector("#"+e.target.dataset.target)
        
        slidenav = M.Sidenav.init(slidenav);
        slidenav.open()
    }
    return (
        <ReactRouterDOM.BrowserRouter>
            <Header isLoggedIn={isLoggedIn} logOut={logOut}/>
            <Sidenav id="main-slidenav"/>
            { (new URLSearchParams(window.location.search)).get("goto") && <ReactRouterDOM.Redirect to={(new URLSearchParams(window.location.search)).get("goto")}/> }
            { !isLoggedIn && <ReactRouterDOM.Route path="/login2" render={()=>  <Login onLogIn={onLogIn} /> } />}
            { isLoggedIn ? 
                <ReactRouterDOM.Route path="/system/viewstats" render={()=>  <SystemView /> } /> 
                : <ReactRouterDOM.Redirect to="/login2?goto=/system/viewstats" />}
        </ReactRouterDOM.BrowserRouter>
    )
}
//<a onClick={openSlideNav} data-target="main-slidenav" className="waves-effect waves-light btn">button</a>
//<ReactRouterDOM.Link to="/new"  href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></ReactRouterDOM.Link>

export default App


