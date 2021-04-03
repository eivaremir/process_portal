
function RecipentEditor({recipent}) {
    const [subscribed, setsubscribed] = React.useState(false)
    
    React.useEffect(()=>{
        setsubscribed(recipent.subscribed)
        
    },[recipent])
    
    const onSubscribedChange = (e)=>{
        console.log(e.target.value)
        setsubscribed(!subscribed)
    }
    
    return (
        <div>
            <form>
            <div className="mb-3">
                <label htmlFor="address" className="form-label"><i class="bi bi-envelope"></i> Email address</label>
                <input type="email" className="form-control" id="address" placeholder="name@example.com" readOnly value={recipent.address ? recipent.address:""} />
            </div>
            <div className="form-check mb-3">
                <input className="form-check-input" onChange={onSubscribedChange} type="checkbox" checked={subscribed} id="subscribed"/>
                <label className="form-check-label" htmlFor="subscribed">Is subscribed</label>
            </div>
            <div className="mb-3">
                <label htmlFor="tags" className="form-label"><i class="bi bi-tag"></i> Tags</label>
                <div className="input-group">
                    <input type="text" className="form-control" id="tags" placeholder="tag" />
                    <button className="btn btn-primary"><i class="bi bi-plus"></i></button>
                </div>
                <div className="mt-3">
                    {
                        recipent.tags.split("|").map((tag,ti)=>(
                            tag && <span key={tag+"-"+ti} className="badge rounded-pill  bg-secondary px-2" style={{margin: "0 .3em"}}>
                                {tag}
                                <button type="button" class="btn-close" aria-label="Close"></button>
                            </span>
                        ))
                    }
                </div>
            </div>

            </form>
        </div>
    )
}

export default RecipentEditor
