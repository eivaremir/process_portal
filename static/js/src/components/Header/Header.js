import HeaderItem from './HeaderItem.js'

function Header(props) {
    return (
        
        <nav className="header">
            <div className="nav-wrapper">
                <a href="#" className="brand-logo right">
                    <img className="logo" src="/static/img/ZumaMarkets_black_backpng.png"></img>
                </a>
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                <HeaderItem text="Log Out" onClick={props.logOut} />
                
                
                </ul>
            </div>
        </nav>
    )
}

export default Header
