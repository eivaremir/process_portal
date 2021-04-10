import EmailTagSelector from './EmailTagSelector.js'

function EmailCreator({onGetBack}) {
    const [html, sethtml] = React.useState("")
    const [subject, setsubject] = React.useState("")
    const [fromName, setfromName] = React.useState("")
    const [from, setfrom] = React.useState("")
    const [to, setto] = React.useState("")
    const [selectByTag, setselectByTag] = React.useState(false)
    const [tagsSelected, settagsSelected] = React.useState([])
    const [availableTags, setavailableTags] = React.useState([])
    const [templates, settemplates] = React.useState({
        columns:[],
        data:[],
        parsed:[]
    })

    const onEmailBodyChanged = (e)=>{
        document.getElementById("email-preview").innerHTML = e.target.value
        sethtml(e.target.value)
    }
    const onSelectTags = async ()=>{
        console.log("updating tags")
        setavailableTags(await fetch("/tags").then((res)=>{return res.json()}).then((json)=>{return json.data}))
    }
    const onTagSelected = (e)=>{
        const tag = e.target.dataset.tag
        console.log(tag)
        settagsSelected(tagsSelected.concat(tag))
    }
    const onSelectedTagRemoved =(e)=>{
        settagsSelected(tagsSelected.filter(tag=> tag!=e.target.dataset.tag))
    }
    const sendEmail = async ()=>{

        const response = await fetch("/email/send",{
            method: 'PUT',
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
                body: html,
                subject: subject,
                from_name: fromName  ,
                from: from,
                to: to,
                byTag: selectByTag,
                tags: tagsSelected
                
            })
        }).then((res)=>{return res.json()})
        console.log(response)
    }
    const saveAsTemplate = async ()=>{
        await fetch("/email/templates/save",{
            method: 'PUT',
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
                html: html,
                subject: subject
            })
        }).then((res)=>{
            return res.json()
        }).then((data)=>{
            console.log(data)
        })

    }
    const getTemplates = async()=>{
        await fetch("/email/templates").then((res)=>{return res.json()}).then((data)=>{
            console.log(data)
            settemplates(data)
        })
    }
    React.useEffect(() => {
        getTemplates()
    }, [])

    const onTemplateClicked = (e)=>{
        sethtml(templates.parsed[e.target.dataset.template].html)
        document.getElementById("email-preview").innerHTML = templates.parsed[e.target.dataset.template].html
    }
    return (
        <div>
            <h1>Create Email</h1>
            <div className="row">
                <nav class="navbar mb-3">
                    
                    <div >
                    <button className="btn btn-danger" onClick={onGetBack}><i class="bi bi-arrow-return-left"></i> Cancel</button>
                    <button onClick={sendEmail} className="btn btn-primary mx-1"><i class="bi bi-arrow-right-circle-fill"></i> Send</button>
                    <button onClick={saveAsTemplate} className="btn btn-secondary"><i class="bi bi-hdd-fill"></i> Save as template</button>
                    </div>
                </nav>
            </div>
            <div className="row">
                <section className="mb-3 col-md-12">
                    <form>
                        <fieldset>
                        <legend>Contact Information</legend>


                        <div className="mb-2 ">
                            <label for="email_from" class="form-label">From</label>
                            <div className="input-group mb-3">
                                <input onChange={(e)=>setfrom(e.target.value+"@zumamarkets.com")} id="email_from" type="text" class="form-control" aria-label="Text input with dropdown button"/>
                                <label class="input-group-text" for="email_from">@zumamarkets.com</label>
                            </div>
                            
                        </div>
                        <div class="btn-group mb-2">
                                <a href="#" onClick={()=>{setselectByTag(false)}} class={`btn btn-primary ${!selectByTag ? "active" : null}`} aria-current="page">Write recipent emails</a>
                                <a href="#" onClick={()=>{setselectByTag(true)}} class={`btn btn-primary ${ selectByTag ? "active" : null}`}>Select recipents by tags</a>
                            </div>
                        <div className="">
                            <label for="email_to" class="form-label">To</label>
                            {!selectByTag && <input onChange={(e)=>setto(e.target.value)} type="email" class="form-control" id="email_to" placeholder="name@example.com" />}
                        </div>
                        </fieldset>
                    </form>
                    {selectByTag &&
                            <>
                                <button onClick={ onSelectTags} class="btn btn-primary mb-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Select tags</button>
                                <EmailTagSelector removeTag={onSelectedTagRemoved} onTagSelected={onTagSelected} selectedTags={tagsSelected} availableTags={availableTags}/>
                                <div>
                                    
                                    <label>Tags Selected</label> <br/>
                                    {
                                        tagsSelected.map((el)=>(
                                            <span class="badge rounded-pill bg-secondary ms-1" key={el}>{el}</span>
                                        ))
                                    }
                                </div>
                            </>
                            }
                </section>
            </div>
            
            <div className="row">
                <section className="col me-1">
                    <form>
                        <fieldset>
                        <div class="d-flex justify-content-between">
                            <legend>Content</legend>
                            <button onClick={(e)=>{e.preventDefault();}} className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#templatesModal">Templates</button>
                            
                        </div>
                            
                            <div className="mb-2">
                                <div className="mb-2">
                                    <label for="email_subject" class="form-label">Subject</label>
                                    <input onChange={(e)=>setsubject(e.target.value)} id="email_subject" type="text" class="form-control" aria-label="Text input with dropdown button"/>
                                </div>
                            </div>
                            <div className="mb-2">
                                <label for="email_body" class="form-label">Subject</label>
                                <textarea value={html} onChange={onEmailBodyChanged} style={{height: "400px"}} class="form-control" placeholder="<html>...</html>" id="email_body"></textarea>        
                            </div>
                        </fieldset>
                    </form>
                </section>   
                <section className="col ms-1">
                    <div id="email-preview">
                        
                    </div>
                </section> 
            </div>
            <div class="modal fade" id="templatesModal" tabindex="-1" aria-labelledby="templatesModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="templatesModalLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table className="table">
                        <thead>
                            <tr>
                                {
                                    templates.columns.map((column,c)=>(
                                        <th key={c}>{column}</th>
                                    ))
                                }
                            </tr>
                            
                        </thead>
                        <tbody>
                            {
                                templates.data.map((row,r)=>(
                                    <tr onClick={onTemplateClicked} data-template={r} style={{cursor:'pointer'}} data-bs-dismiss="modal">
                                        {
                                            row.map((column,c)=>(
                                                <td  data-template={r}   key={r+"-"+c}>{column}</td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default EmailCreator
