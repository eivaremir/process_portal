
function DocumentItem({document, onDocumentSelected}) {
    return (
        
            <tr onClick={onDocumentSelected} data-document={document[0]} className="document-item" >
                { document.map((column,c)=>( <td key={"column-"+c}>{column}</td> )) }
                
            
        </tr>
    )
}

export default DocumentItem
