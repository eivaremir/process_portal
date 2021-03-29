import DocumentsView from "./DocumentsView"
import DocumentItem from "./DocumentItem.js"
function DocumentsList({ onShowCreate, onDocumentSelected, documents}) {
    
    

    
    return (
        <div>
            <h1>Documents</h1>
            <a onClick={onShowCreate} style={{position:"fixed",bottom:"40px",right:"40px"}} className="btn-floating btn-large waves-effect waves-light red">
                <i className="material-icons">add</i>
            </a>
            <table>
                <thead>
                    <tr>
                        {documents && documents.columns.map((column,c)=>(
                            <td key={"column-name-"+c}>{column}</td>
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
