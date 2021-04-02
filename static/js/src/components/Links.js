import LinksList from './LinksView/LinksList.js'
import LinkEditor from './LinksView/LinkEditor.js'
export default class Links extends React.Component {
    constructor(props){
        super(props)
        this.state={
            links: {
                columns: [],
                data: [],
                parsed: []
            }
        }
    }
    async componentDidMount(){
        const links = await this.fetchLinks()
        
        this.setState({
            links : links
        })
    }
    async fetchLinks(){
        return await fetch("/rl/get").then((res)=> {return res.json()})
        
    }
    render() {
        return (
            <div>
                <h1>Links</h1>
                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        <LinksList links={this.state.links} />
                    </div>
                    <div className="col-md-6 col-sm-12">
                        <LinkEditor />
                    </div>
                </div>
            </div>
        )
    }
}
