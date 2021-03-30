import DocumentEditor from "./DocumentEditor";

function Document({toggleShow, document,documentEdit}) {
    return (
        <div>
            <div>
                    <button className="btn" onClick={toggleShow}>
                        <i className="material-icons">arrow_back</i>
                    </button>
                    <button className="btn" onClick={()=>documentEdit(document.id_document)}>
                        <i className="material-icons">edit</i>
                    </button>
                </div>
                <h1>{document.title}</h1>
                
                <DocumentEditor readonly={true} data={document.data}/>
        </div>
    )
}

export default Document
