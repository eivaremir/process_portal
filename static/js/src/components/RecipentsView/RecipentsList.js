

function RecipentsList({recipents,onRecipentSelected,tagsIndex}) {
    
    
    
    
    
    return (
        <div>
            <table className="table table-sm">
                <thead>
                    <tr>
                        {
                            recipents.columns.map((column,i)=>(
                                <th key={`${column}-${i}`}>{column}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                        {
                            recipents.data.map((recipent,r)=>(
                                <tr onClick={()=>onRecipentSelected(r)} key={recipent+"-"+r}>
                                    {
                                        recipent.map((column,c)=>{
                                            if(c==tagsIndex) return (
                                                <td key={column+"-"+c}>

                                                    {
                                                        column.split("|").map((tag,ti)=>(
                                                            <span key={tag+"-"+ti} class="badge rounded-pill  bg-secondary mx-1 px-2">{tag}</span>
                                                        ))
                                                    }

                                                </td>
                                            )
                                            else return (<td key={column+"-"+c}>{column}</td>)
                                        })
                                    }
                                </tr>
                            ))
                        }
                </tbody>
            </table>
        </div>
    )
}

export default RecipentsList
