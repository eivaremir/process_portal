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
    const onEmailBodyChanged = (e)=>{
        document.getElementById("email-preview").innerHTML = e.target.value
        sethtml(e.target.value)
    }
    const onSelectTags = async ()=>{
        console.log("updating tags")
        setavailableTags(await fetch("/tags").then((res)=>{return res.json()}).then((json)=>{return json.data}))
    }
    const sendEmail = async ()=>{
        const response = await fetch("/email/send",{
            method: 'PUT',
            headers: { "Content-Type":"application/json" },
            body: JSON.strikngify({
                body: html,
                subject: subject,
                from_name: fromName  ,
                from: from,
                to: to
                
            })
        }).then((res)=>{return res.json()})
        console.log(response)
    }

    return (
        <div>
            <h1>Create Email</h1>
            <div className="row">
                <nav class="navbar mb-3">
                    <div >
                    <button className="btn btn-danger" onClick={onGetBack}><i class="bi bi-arrow-return-left"></i> Cancelar</button>
                    <button onClick={sendEmail} className="btn btn-primary mx-1"><i class="bi bi-arrow-right-circle-fill"></i> Enviar</button>
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
                        <div className="mb-2">
                            <label for="email_to" class="form-label">To</label>
                            
                            
                            
                            {!selectByTag && <input onChange={(e)=>setto(e.target.value)} type="email" class="form-control" id="email_to" placeholder="name@example.com" />}
                            
                        </div>
                        </fieldset>
                    </form>
                    {selectByTag &&
                            <>
                                <button onClick={ onSelectTags} class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Select tags</button>
                                <EmailTagSelector availableTags={availableTags}/>
                                <div>
                                    <label>Tags Selected</label>

                                </div>
                            </>
                            }
                </section>
            </div>
            
            <div className="row">
                <section className="col me-1">
                    <form>
                        <fieldset>
                            
                            <legend>Content</legend>
                            <div className="mb-2">
                                <div className="mb-2">
                                    <label for="email_subject" class="form-label">Subject</label>
                                    <input onChange={(e)=>setsubject(e.target.value)} id="email_subject" type="text" class="form-control" aria-label="Text input with dropdown button"/>
                                </div>
                            </div>
                            <div className="mb-2">
                                

                                    
                                    <label for="email_body" class="form-label">Subject</label>
                                    
                                    <textarea onChange={onEmailBodyChanged} style={{height: "400px"}} class="form-control" placeholder="<html>...</html>" id="email_body"></textarea>
                                        
                            </div>
                        </fieldset>
                    </form>
                </section>   
                <section className="col ms-1">
                    <div id="email-preview">
                        
                    </div>
                </section> 
            </div>
            
        </div>
    )
}

export default EmailCreator
