let View = ({ res, expression }) => {
    return (
        <div className='view'>
            <div className='expression'>{ expression }</div>
            <div className='result'>
                <h2>{ res }</h2>
            </div>
        </div>
        
    )
}

export default View