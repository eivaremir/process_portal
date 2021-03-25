var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Calculator from './components/Calculator.js';
//import Button from '/material-ui/core/Button';
import Sidenav from './components/Sidenav.js';

function App() {
    var _React$useState = React.useState(true),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        sideNavOpen = _React$useState2[0],
        setSideNavOpen = _React$useState2[1];

    var openSlideNav = function openSlideNav(e) {
        var slidenav = document.querySelector("#" + e.target.dataset.target);

        slidenav = M.Sidenav.init(slidenav);
        slidenav.open();
    };
    return React.createElement(
        'div',
        null,
        React.createElement(Sidenav, { id: 'main-slidenav' }),
        React.createElement(
            'a',
            { onClick: openSlideNav, 'data-target': 'main-slidenav', className: 'waves-effect waves-light btn' },
            'button'
        ),
        React.createElement(
            'a',
            { href: '#', 'data-target': 'slide-out', className: 'sidenav-trigger' },
            React.createElement(
                'i',
                { className: 'material-icons' },
                'menu'
            )
        )
    );
}

export default App;