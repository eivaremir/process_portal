
import Toast from '../Toast.js'

function ImportCSVModal({id}) {
    const [data, setdata] = React.useState("")
    const [importing, setimporting] = React.useState(false)
    const [importResult, setimportResult] = React.useState(undefined)
    const [importFinished, setimportFinished] = React.useState(false)
    const [error, seterror] = React.useState("")
    const [successToast, setsuccessToast] = React.useState(undefined)
    const [failToast, setfailToast] = React.useState(undefined)

    React.useEffect(() => {
        const succToast =new bootstrap.Toast( document.querySelector('#import-success'),{autohide: true,delay:7500})
        const fToast = new bootstrap.Toast( document.querySelector('#import-failed'),{autohide: true,delay:7500}) 
        setsuccessToast(succToast)
        setfailToast(fToast)
    }, [])
    React.useEffect(() => {
        
        if(importResult===true){
            successToast.show()
        }
        else if(importResult===false){
            failToast.show()
        }
        console.log("show toast")
        setimportResult("waiting")
    }, [importResult])
    const onChange=(e)=>{
        setdata(e.target.value)
    }
    const onImport= async ()=>{
        setimporting(true)
        
        var modalEl = document.getElementById(id)
        var modal = bootstrap.Modal.getInstance(modalEl)
        
        const resp = await importData(data)
        .then((resp)=>{ 
            setimporting(false)
            setimportFinished(true)
            if(resp.status){
                setimportResult(true)
                seterror("")
            }
            else{
                setimportResult(false)
                seterror(resp.exception)
            }
            return resp
        }).catch((e)=>{ 
            setimporting(false)
            setimportResult(false)
            seterror("Conection Error "+e)
        })
        console.log(data)
        console.log(resp)
        
        
        
    }
    const importData = async (d)=>{
        return fetch("/recipents/import",{
            method: 'PUT',
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
                    data: d
                })
            }).then((res)=> {return res.json()})
    }
    const fetchRecipents = async ()=>{

    }
    return (
        <div id={id} className="modal" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Import CSV</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <p>Please, paste your csv below, data here must contain the following columns:  <code>address</code>, <code>subscribed</code>  (0,1), <code>tags</code>  ({"{tagA:A}"})</p>
                <div className="form-floating">
                    <textarea onChange={onChange} className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "500px"}}></textarea>
                    <label htmlFor="floatingTextarea2">CSV</label>
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button onClick={onImport} type="button" className="btn btn-primary">
                    { importing ? 
                    <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Importing... </> 
                    :"Import "}
                    
                    </button>
            </div>
            </div>
        </div>
        <div className="toast-container position-absolute top-0 end-0 p-3">
            { /*importFinished && importResult && */
            <Toast 
                image_url= ""
                hright= ""
                bgColor="bg-success"
                message= "Import succesfully finished"
                id="import-success"/>}

            {/*importFinished && importResult==false && */
            <Toast 
                image_url= ""
                bgColor="bg-danger"
                hright= ""
                message= {error}
                id="import-failed"/>}
        </div>
        </div>
    )
}

export default ImportCSVModal
