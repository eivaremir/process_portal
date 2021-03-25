import Button from "./Button.js";

var Buttons = function Buttons(_ref) {
    var onAction = _ref.onAction;

    return React.createElement(
        'div',
        { className: 'buttons' },
        React.createElement(Button, { dataType: 'number', dataAction: '1', onAction: onAction, label: '1' }),
        React.createElement(Button, { dataType: 'number', dataAction: '2', onAction: onAction, label: '2' }),
        React.createElement(Button, { dataType: 'number', dataAction: '3', onAction: onAction, label: '3' }),
        React.createElement(Button, { dataType: 'operation', dataAction: '/', onAction: onAction, label: '/' }),
        React.createElement(Button, { dataType: 'number', dataAction: '4', onAction: onAction, label: '4' }),
        React.createElement(Button, { dataType: 'number', dataAction: '5', onAction: onAction, label: '5' }),
        React.createElement(Button, { dataType: 'number', dataAction: '6', onAction: onAction, label: '6' }),
        React.createElement(Button, { dataType: 'operation', dataAction: '*', onAction: onAction, label: '*' }),
        React.createElement(Button, { dataType: 'number', dataAction: '7', onAction: onAction, label: '7' }),
        React.createElement(Button, { dataType: 'number', dataAction: '8', onAction: onAction, label: '8' }),
        React.createElement(Button, { dataType: 'number', dataAction: '9', onAction: onAction, label: '9' }),
        React.createElement(Button, { dataType: 'operation', dataAction: '+', onAction: onAction, label: '+' }),
        React.createElement(Button, { dataType: 'dot', dataAction: '.', onAction: onAction, label: '.' }),
        React.createElement(Button, { dataType: 'number', dataAction: '0', onAction: onAction, label: '0' }),
        React.createElement(Button, { dataType: '', dataAction: 'del', onAction: onAction, label: 'del' }),
        React.createElement(Button, { dataType: 'operation', dataAction: '-', onAction: onAction, label: '-' })
    );
};

export default Buttons;