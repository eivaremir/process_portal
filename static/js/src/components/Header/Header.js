import HeaderItem from './HeaderItem.js'

function Header(props) {
    return (
        
        <nav className="header">
            <div className="nav-wrapper">
                <a href="#" className="brand-logo right">
                    <img className="logo" src="/static/img/ZumaMarkets_black_backpng.png"></img>
                </a>
                
                
                
                
            {props.isLoggedIn ?
            <ul id="nav-mobile" className="left hide-on-med-and-down">
                <li>
                    <svg style={{width: "35px",margin: "0 26px 0 0"}} data-target="main-slidenav" onClick={props.openSlideNav} xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </li>
                <HeaderItem text="Log Out" onClick={props.logOut} />
            </ul>
            : null}
                
                
                
            </div>
        </nav>
    )
}

export default Header
