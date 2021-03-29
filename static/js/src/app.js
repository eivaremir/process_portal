import Calculator from './components/Calculator.js'
//import Button from '/material-ui/core/Button';
import Sidenav from './components/Sidenav.js'
import Header from './components/Header/Header.js'
import Breadcrumb from './components/Breadcrumb.js'
import Login from './components/Login/Login.js'


// ViewStats
import ViewStats from './components/SystemView/SystemView'
import SystemView from './components/SystemView/SystemView'

// DocumentsView
import DocumentsView from './components/DocumentsView/DocumentsView.js'
function App() {

   


    //const [sideNavOpen, setSideNavOpen] = React.useState(true);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [goto, setgoto] = React.useState(undefined)
    const [sectionlist, setsectionlist] = React.useState(['Documents'])
    
    //

    React.useEffect( () => {
        console.log("Getting Session...")
        const getSession = async () => {
          const session = await fetchSession()
          setIsLoggedIn(session.authenticated)
          console.log("Logged in: "+isLoggedIn)
          console.log("Logged in: "+session.authenticated)
        }
    
        getSession()
        
    },[])
    
    React.useEffect( () => {
        // set goto if its present
        setgoto((new URLSearchParams(window.location.search)).get("goto"))
        //setloc(window.location.pathname)
        // toggle class in root if path is login
        if (window.location.pathname ==="/login2"){
            document.getElementById("root").classList.add("justify-content-center")
            console.log("class added")
        }
        else {
            document.getElementById("root").classList.remove("justify-content-center")
            console.log("class removed")
        }
    })
    
    const fetchSession = async () => {
        const res = await fetch("/session")
        const data = await res.json()
        console.log("session got"+data)
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

        //const urlParams = new URLSearchParams(window.location.search);
    }
    const openSlideNav = (e) =>{
        let slidenav = document.querySelector("#"+e.target.dataset.target)
        
        slidenav = M.Sidenav.init(slidenav);
        slidenav.open()
    }
    console.log("Im logged in: "+isLoggedIn+ " and now in: "+window.location.pathname+window.location.search+" and goto is "+goto)
    //debugger
    return (
        <ReactRouterDOM.BrowserRouter>
            <Header isLoggedIn={isLoggedIn} logOut={logOut}/>
            <Sidenav id="main-slidenav"/>
            
            {/* IF I'M ALREADY LOGGED AND THERES A GOTO, REDIRECT THERE */}
            { isLoggedIn && goto && <ReactRouterDOM.Redirect to={goto}/> }
            {/* (new URLSearchParams(window.location.search)).get("goto") && <ReactRouterDOM.Redirect to={(new URLSearchParams(window.location.search)).get("goto")}/>*/ }
            
            {/* IF IM NOT LOGGED IN... REDIRECT TO LOG IN */}
            { !isLoggedIn && <ReactRouterDOM.Route path="/login2" render={()=>  <Login onLogIn={onLogIn} /> } />}
            {/* ADD IF LOGGED IN AND WANNA GO LOGIN PAGE... REDIRECT WHERE TO ?*/}
            
            <div className="content">
                {isLoggedIn && <Breadcrumb sectionlist={sectionlist} />}



                {/*{ FOR EACH PATH, RENDER IF ITS LOGGGED IN OR REDIRECT WITH GOTO />}*/}
                <ReactRouterDOM.Route path="/new" render={()=> { 
                    return isLoggedIn ? <a onClick={openSlideNav} data-target="main-slidenav" className="waves-effect waves-light btn">button</a> :  <ReactRouterDOM.Redirect to="/login2?goto=/new" />
                }} /> 
                <ReactRouterDOM.Route path="/system/viewstats" render={()=> { 
                    return isLoggedIn ? <SystemView /> :  <ReactRouterDOM.Redirect to="/login2?goto=/system/viewstats" />
                }} /> 
                <ReactRouterDOM.Route path="/documents2" render={()=> { 
                    return isLoggedIn ? <DocumentsView setsectionlist={setsectionlist} /> :  <ReactRouterDOM.Redirect to="/login2?goto=/documents2" />
                }} /> 
            </div>
        </ReactRouterDOM.BrowserRouter>
    )
}
//<a onClick={openSlideNav} data-target="main-slidenav" className="waves-effect waves-light btn">button</a>
//<ReactRouterDOM.Link to="/new"  href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></ReactRouterDOM.Link>

export default App


