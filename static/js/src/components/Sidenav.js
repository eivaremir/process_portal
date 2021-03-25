
function Sidenav({id}) {
    return (
        <ul id="main-slidenav" className="sidenav">
                <li>
                    <div className="user-view">
                        <div className="background">
                            <img src="/static/img/banner-team-office.png" />
                        </div>
                        <a href="#user"><img className="circle" src="/static/img/user.png"/></a>
                        <a href="#name"><span className="white-text name">John Doe</span></a>
                        <a href="#email"><span className="white-text email">jdandturk@gmail.com</span></a>
                    </div>
                </li>
                <li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>
                <li><a href="#!">Second Link</a></li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">Subheader</a></li>
                <li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
            </ul>
    )
}

export default Sidenav