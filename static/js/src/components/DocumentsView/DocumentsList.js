import DocumentsView from "./DocumentsView"
import DocumentItem from "./DocumentItem.js"
function DocumentsList({ onShowCreate, onDocumentSelected, documents}) {
    
    

    
    return (
        <div>
            <h1>Documents</h1>
            <a onClick={onShowCreate} style={{position:"fixed",bottom:"40px",right:"40px"}} className="btn-floating btn-large waves-effect waves-light red">
                <i className="material-icons">add</i>
            </a>
            <table  className="table table-sm">
                <thead>
                    <tr >
                        {documents && documents.columns.map((column,c)=>(
                            c < documents.columns.length-1 ? <th scope="col" key={"column-name-"+c}>{column}</th> : null
                        ))}
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        documents && documents.documents.map((document,d)=>(
                            
                             <DocumentItem onDocumentSelected={onDocumentSelected} document={document} key={d}/>
                            

                        ))
                    }   
                </tbody>
            </table>
        </div>
    )
}

export default DocumentsList
