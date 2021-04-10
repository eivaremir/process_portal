
function EmailList() {
    const [emails, setemails] = React.useState({
        columns:[],
        data:[],
        parsed:[]
    })
    React.useEffect( async () => {
        /*getEmails =async  ()=>{
            await
        }*/
        await fetch("/email/get").then((res)=>{return res.json()}).then((data)=>{
            setemails(data)
        })
    }, [])

    const onEmailPreview = (e)=>{
        console.log(e.target)
        if( e.target.localName == "i"){
            console.log(e.target.parentElement.dataset.email)
            console.log(emails.parsed[e.target.parentElement.dataset.email].html)
            document.querySelector("#email-preview-body").innerHTML=emails.parsed[e.target.parentElement.dataset.email].html
        }
        else{
            console.log(e.target.dataset.email)
            console.log(emails.parsed[e.target.dataset.email].html)
            document.querySelector("#email-preview-body").innerHTML=emails.parsed[e.target.dataset.email].html
        }
        
    }
    return (
        <div>
            <div class="modal fade" id="email-preview" tabindex="-1" aria-labelledby="email-previewLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="email-previewLabel">Modal title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="email-preview-body">
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
            </div>
            <table className="table"> 
                <thead>
                    <tr>
                        {
                            emails.columns.map((column,c)=>(
                                <th key={c}>{column}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    
                    {
                        emails.data.map((row,r)=>(
                            <tr key={"email-"+r}>
                                {
                                    row.map((column,c)=>(
                                        <td key={"email-"+r+"-column-"+c}>
                                            {
                                                emails.columns[c] == "html" ?  <button onClick={onEmailPreview} data-email={r} type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#email-preview"><i data-email={r} class="bi bi-eye-fill"></i></button>
                                                : column
                                            }
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default EmailList
