function Button(_ref) {
    var label = _ref.label,
        onAction = _ref.onAction,
        dataAction = _ref.dataAction,
        dataType = _ref.dataType;

    return React.createElement(
        'button',
        { 'data-type': dataType, 'data-action': dataAction, onClick: onAction, className: 'btn' },
        label
    );
}

export default Button;