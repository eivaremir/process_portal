import Calculator from './components/Calculator.js'
//import Button from '/material-ui/core/Button';
import Sidenav from './components/Sidenav.js'

function App() {
    const [sideNavOpen, setSideNavOpen] = React.useState(true);
    const openSlideNav = (e) =>{
        let slidenav = document.querySelector("#"+e.target.dataset.target)
        
        slidenav = M.Sidenav.init(slidenav);
        slidenav.open()
    }
    return (
        <div>
            <Sidenav id="main-slidenav"/>
            <a onClick={openSlideNav} data-target="main-slidenav" className="waves-effect waves-light btn">button</a>
            <a  href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        </div>
    )
}

export default App


