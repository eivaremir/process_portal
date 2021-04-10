



function Sidenav({id,session,logOut}) {

    const [path, setpath] = React.useState(window.location.pathname)
    const [changePath, setchangePath] = React.useState(false)
    //const [sidenavScrollTrig, setsidenavScrollTrig] = React.useState(undefined)
    
    
    React.useEffect(() => {
        setpath(window.location.pathname)
        console.log("changed path")
        setchangePath(false)
        
    },[changePath])
    
    const onLinkClicked = ()=>{
        setchangePath(true)
    }
    return (
        

        <div id="sidenav" className="d-flex flex-column p-3 text-white bg-dark" style={{width: "280px"}}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none" >
                <svg className="bi me-2" width="40" height="32"><use href="#bootstrap"></use></svg>
                <span className="fs-4">
                    <img src="/static/img/ZumaMarkets_black_backpng.png" style={{width:"100%"}}/>
                </span>
            </a>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto">
                
                <li>
                
                    <ReactRouterDOM.Link onClick={onLinkClicked} to="/documents2"  className={`nav-link text-white ${path == "/documents2" ? "active":""}`} href="#!">
                        <i className="bi me-2 bi-house"></i>
                        Documents
                    </ReactRouterDOM.Link>
                </li>
                <li>
                    <ReactRouterDOM.Link onClick={onLinkClicked} to="/recipents"  className={`nav-link text-white ${path == "/recipents" ? "active":""}`} href="#!">
                    
                        <i className="bi me-2 bi-person-lines-fill"></i>
                        Recipents
                    </ReactRouterDOM.Link>
                </li>
                <li>
                    <ReactRouterDOM.Link onClick={onLinkClicked} to="/links"  className={`nav-link text-white ${path == "/links" ? "active":""}`} href="#!">
                    
                        <i className="bi me-2 bi-link-45deg"></i>
                        Links
                    </ReactRouterDOM.Link>
                </li>
                <li>
                    <ReactRouterDOM.Link onClick={onLinkClicked} to="/email"  className={`nav-link text-white ${path == "/email" ? "active":""}`} href="#!">
                        <i class="bi me-2 bi-envelope-fill"></i>
                        E-Mail
                    </ReactRouterDOM.Link>
                </li>
                
            </ul>
            <hr />
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="/static/img/user.png" alt="mdo" width="32" height="32" className="rounded-circle me-2"/>
                <strong>{session.name}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    {/*<li><a className="dropdown-item" href="#">New project...</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li><hr className="dropdown-divider"/></li>*/}
                    <li><a className="dropdown-item" href="#" onClick={logOut}>Sign out</a></li>
                </ul>
            </div>
        </div>
    )
}
/*
        <ul id="main-slidenav" className="sidenav">
                <li>
                    <div className="user-view">
                        <div className="background">
                            <img style={{height: "100%", position:" relative", left:" 50%", transform: "translateX(-50%)"}} src="/static/img/banner-team-office.png" />
                        </div>
                        <a href="#user"><img className="circle" src="/static/img/user.png"/></a>
                        <a href="#name"><span className="white-text name">{session.name}</span></a>
                        <a href="#email"><span className="white-text email">{session.username}</span></a>
                        <a href="#role"><span className="white-text">{session.role}</span></a>
                    </div>
                </li>
                <li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>
                <li><a href="#!">Second Link</a></li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">Subheader</a></li>
                <li><a className="waves-effect" href="#!">Third Link With Waves</a></li> 
                <li><ReactRouterDOM.Link to="/links"  className="waves-effect" href="#!">Links </ReactRouterDOM.Link> </li>
                <li><ReactRouterDOM.Link to="/documents2"  className="waves-effect" href="#!">Documents</ReactRouterDOM.Link> </li>
            </ul>*/
export default Sidenav