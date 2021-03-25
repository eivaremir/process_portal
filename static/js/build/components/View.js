var View = function View(_ref) {
    var res = _ref.res,
        expression = _ref.expression;

    return React.createElement(
        'div',
        { className: 'view' },
        React.createElement(
            'div',
            { className: 'expression' },
            expression
        ),
        React.createElement(
            'div',
            { className: 'result' },
            React.createElement(
                'h2',
                null,
                res
            )
        )
    );
};

export default View;