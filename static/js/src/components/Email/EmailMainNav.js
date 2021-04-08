
function EmailMainNav({ onCreate }) {
    


    return (
        <div className="row">
            <nav class="navbar">
                <div>
                    
                        <button className="btn btn-primary" onClick={onCreate} >
                            <i class="bi bi-plus"></i>
                            Create
                        </button>
                    
                </div>
            </nav>
        </div>
        
    )
}

export default EmailMainNav
