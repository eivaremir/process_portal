import CreateDocument from './CreateDocument.js'
import DocumentsList from './DocumentsList.js'
import Document from './Document.js'
import DocumentEditor from './DocumentEditor.js'



function DocumentsView({ setsectionlist }) {
    const [showcreatedoc, setshowcreatedoc] = React.useState(false)
    const [showdoc, setshowdoc] = React.useState(false)
    
    // selected document data for Document Component
    const [docdata, setdocdata] = React.useState([])

    const [editdoc, seteditdoc] = React.useState(false)
    
    const { search } = ReactRouterDOM.useLocation()
    //const { document } = queryString.parse(search)
    
    // ALL DOCUMENT DATA
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
    },[editdoc])
    const fetchDocuments = async ()=>{
        const res = await fetch("/documents/get")
        const data = await res.json()
        console.log(data)
        return data
    }
    // ------------------------ END FETCH DOCUMENTS --------------------------
    

    React.useEffect(()=>{
        if (getQueryParams(search).document &&getQueryParams(search).edit){
            seteditdoc( true)
            console.log(getQueryParams(search).document)

        }
            
            

        
    },[])

    const onShowCreate = ()=>{
        setshowcreatedoc(!showcreatedoc)
        setsectionlist(['Documents','create'])
    }
    const onShowEdit = ()=>{
        seteditdoc(!editdoc)
        
    }
    const onToggleDocument = (e)=>{
        const selected=e.target.parentElement.dataset.document
        //console.log(documents.parsed)
        //console.log(documents.parsed.filter(document => document.id_document==selected))
        //console.log(documents.parsed.filter(document => document.id_document==selected)[0].data.replaceAll('"','\"').replaceAll("'",'"'))
        setdocdata(documents.parsed.filter(document => document.id_document==selected)[0])
        setshowdoc(!showdoc)
        
    }
    const documentEdit = (document)=>{
        const documentToEdit = documents.parsed.filter((doc)=>doc.id_document == document)[0]
        onShowEdit()
        setshowdoc(!showdoc)
    }
    return (
        <div>
            
            {!editdoc && !showdoc && !showcreatedoc && 
            <DocumentsList documents={documents} onDocumentSelected={onToggleDocument} onShowCreate={onShowCreate} /> }
            
            { showcreatedoc && 
            <CreateDocument   toggleShow={onShowCreate} />}
            { editdoc &&
            <CreateDocument title={"Edit: "+docdata.title} document_code={docdata.id_document} document_name={docdata.title} document_lang={docdata.lang} document_data={docdata.data}  toggleShow={onShowEdit} />}
            { showdoc && 
            <Document document={docdata} toggleShow={onToggleDocument} documentEdit={documentEdit}/>}

        </div>
    )
}

export default DocumentsView

