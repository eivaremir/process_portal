

function EmailTagSelector({availableTags,onTagSelected, selectedTags,removeTag}) {

    const [search, setsearch] = React.useState("")
    //const [selectedTags, setselectedTags] = React.useState([])
    
   

    return (
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
                <h5 id="offcanvasRightLabel">Select Tags</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <form>
                    <input type="text" onChange={(e)=>setsearch(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="tag"/>
                </form>
                <div className="tags my-3">
                    <h5>Available Tags</h5>
                    {availableTags.filter(el => el.search(search) !=-1  ).map((el)=>(
                        <span onClick={!selectedTags.find(st=>st==el) ? onTagSelected : null} key={el} data-tag={el} class="badge rounded-pill bg-secondary ms-1">{el}</span>
                    ))}
                    
                </div>
                <hr/>
                {selectedTags.length ? 
                    <div className="selected-tags my-3">
                        <h5>Selected Tags</h5>
                        {selectedTags.map((el)=>(
                                <span key={el} onClick={removeTag} data-tag={el} class="badge rounded-pill bg-primary ms-1">{el}</span>
                            ))}
                    </div>: null
                }
            </div>
        </div>
    )
}

export default EmailTagSelector
