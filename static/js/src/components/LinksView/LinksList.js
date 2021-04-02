

export default class LinksList extends React.Component {
    constructor(props){
        super(props)
        //console.log(this.props.links)
        //console.log(JSON.stringify(this.props.links))
    }
    render() {
        console.log(this.props.data)
        return (
            <table>
                <thead>
                    <tr> { this.props.links.columns.map((m)=>( <td key={m}>{m}</td> )) }</tr>
                </thead>
                <tbody>
                    {
                        this.props.links.data.map((link)=>(
                            <tr key={link[0]}>
                                {link.map((attr)=>(
                                    <td key={attr}>
                                        
                                            {attr.match(/^https?/g) ? <a href={attr}>{attr}</a> : <span>{attr}</span>}
                                        
                                    </td>
                                ))}
                            </tr>
                        ))
                    }
                    
                </tbody>
            </table>
        )
    }
}