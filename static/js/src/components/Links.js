import LinksList from './LinksView/LinksList.js'
import LinkEditor from './LinksView/LinkEditor.js'
import LinksMainNav from './LinksView/LinksMainNav.js'
export default class Links extends React.Component {
    constructor(props){
        super(props)
        this.state={
            links: {
                columns: [],
                data: [],
                parsed: []
            },
            newLinkName:"",
            newLinkURL:""
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
    async updateLinks(){
        this.setState({
            links : await fetch("/rl/get").then((res)=> {return res.json()})
        })
    }
    async createLink(){
        await fetch("/rl/save",{
            method: 'PUT',
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
                link_name: this.state.newLinkName,
                redirect_to: this.state.newLinkURL
            })

        }).then(()=>{
            this.updateLinks()
        })
        
    }
    render() {
        return (
            <div>
                <h1>Links</h1>
                <LinksMainNav />
                
                <div class="modal fade" id="createLinkModal" tabindex="-1" aria-labelledby="createLinkModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createLinkModalLabel">Create Link</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            
                            <div class="mb-3">
                                <label for="link_name" class="form-label">Link name</label>
                                <input onChange={(e)=>{this.setState({newLinkName:e.target.value})}} type="text" class="form-control" id="link_name" placeholder="LAT01_69"/>
                                <label for="link_url" class="form-label">URL</label>
                                <input onChange={(e)=>{this.setState({newLinkURL:e.target.value})}} type="text" class="form-control" id="link_url" placeholder="https://clientzone.zumamarkets.com/register?lead_source=LAT01_690"/>
                            </div>
                            
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        <button onClick={this.createLink.bind(this)} type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>
                
                
                <div className="row">
                    <section className="col-md-6 col-sm-12 mb-3">
                        <LinksList links={this.state.links} />
                    </section>
                    {/*<div className="col-md-6 col-sm-12">
                        <LinkEditor />
                    </div>*/}
                </div>
                
            </div>
        )
    }
}
