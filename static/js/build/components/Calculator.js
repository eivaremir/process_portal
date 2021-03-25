var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import View from './View.js';
import Buttons from './Buttons.js';

function Calculator() {
    var _React$useState = React.useState(''),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        expression = _React$useState2[0],
        setExpression = _React$useState2[1];

    var _React$useState3 = React.useState(0),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        res = _React$useState4[0],
        setRes = _React$useState4[1];

    React.useEffect(function () {
        try {
            setRes(eval(expression));
        } catch (ex) {
            //console.log(ex)
        }
    }, [expression]);

    var onAction = function onAction(e) {
        //e.preventDefault()
        // write expression
        if (e.target.dataset.type === 'number' || e.target.dataset.type === 'operation' || e.target.dataset.type === 'dot') {
            console.log(e.target.dataset.action);
            setExpression(expression + e.target.dataset.action);
        }
        if (e.target.dataset.action == 'del') {
            setExpression(expression.slice(0, expression.length - 1));
        }

        // calculate expression
        //if (e.dataset.type === 'number'){
        //console.log('calculating...')
        //
        //}
    };

    return React.createElement(
        'div',
        { className: 'calculator' },
        React.createElement(View, { res: res ? res : 0, expression: expression ? expression : 0 }),
        React.createElement(Buttons, { onAction: onAction })
    );
}

export default Calculator;