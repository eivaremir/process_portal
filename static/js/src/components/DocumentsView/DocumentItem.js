
function DocumentItem({document, onDocumentSelected}) {
    return (
        
            <tr onClick={onDocumentSelected} data-document={document[0]}  className="document-item" >
                { document.map((column,c)=>( c< document.length-1 ? <td scope={c==0 && "row"} key={"column-"+c}>{column}</td> : null )) }
                
            
        </tr>
    )
}

export default DocumentItem
