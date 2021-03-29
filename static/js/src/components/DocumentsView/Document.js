import DocumentEditor from "./DocumentEditor";

function Document({toggleShow, document}) {
    return (
        <div>
            <div>
                    <button className="btn" onClick={toggleShow}>
                        <i className="material-icons">arrow_back</i>
                    </button>
                    
                </div>
                <h1>{document.title}</h1>
                
                <DocumentEditor readonly={true} data={JSON.parse(document.data)}/>
        </div>
    )
}

export default Document
