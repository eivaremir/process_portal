function Button( { label, onAction, dataAction, dataType } ) {
    return (
        <button data-type={dataType} data-action={dataAction} onClick={onAction} className='btn'>
            { label }
        </button>
    )
}

export default Button
