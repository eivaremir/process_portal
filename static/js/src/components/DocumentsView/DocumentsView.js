import CreateDocument from './CreateDocument.js'
import DocumentsList from './DocumentsList.js'
import Document from './Document.js'
function DocumentsView({ setsectionlist }) {
    const [showcreatedoc, setshowcreatedoc] = React.useState(false)
    const [showdoc, setshowdoc] = React.useState(false)
    const [docdata, setdocdata] = React.useState([])
    const [documents, setdocuments] = React.useState({
        documents: [[]],
        columns:[]
    })
    
    // -------------------------- FETCH DOCUMENTS ---------------------------
    React.useEffect( () => {
        console.log("Getting Documents...")
        const getDocuments = async ()=>{
            const Documents = await fetchDocuments()
            setdocuments(Documents)

        }
        getDocuments()
    },[])
    const fetchDocuments = async ()=>{
        const res = await fetch("/documents/get")
        const data = await res.json()
        console.log(data)
        return data
    }
    // ------------------------ END FETCH DOCUMENTS --------------------------
    const onShowCreate = ()=>{
        setshowcreatedoc(!showcreatedoc)
        setsectionlist(['Documents','create'])
    }

    const onToggleDocument = (e)=>{
        const selected=e.target.parentElement.dataset.document
        //console.log(documents.parsed)
        //console.log(documents.parsed.filter(document => document.id_document==selected))
        //console.log(documents.parsed.filter(document => document.id_document==selected)[0].data.replaceAll('"','\"').replaceAll("'",'"'))
        setdocdata(documents.parsed.filter(document => document.id_document==selected)[0])
        setshowdoc(!showdoc)
        
    }
    return (
        <div>
            
            { !showdoc && !showcreatedoc && <DocumentsList documents={documents} onDocumentSelected={onToggleDocument} onShowCreate={onShowCreate} /> }
            
            { showcreatedoc && <CreateDocument  toggleShow={onShowCreate} />}
            
            { showdoc && <Document document={docdata} toggleShow={onToggleDocument} />}
            
        </div>
    )
}

export default DocumentsView
