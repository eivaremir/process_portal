import RecipentsList from './RecipentsView/RecipentsList.js'
import RecipentEditor from './RecipentsView/RecipentEditor.js'
import ImportCSVModal from './Modal/ImportCSVModal.js'
export default class RecipentsView extends React.Component {
    

    constructor(props){
        super(props)
        this.state = {
             recipents : {
                 columns:[],
                 data:[],
                 parsed:[{
                     address:'',
                    subscribed:'',
                    tags:''
                 }]
             },
             selectedRecipent: { tags: ""},
             tagsIndex: 0
        }
    }

    async componentDidMount(){
        const recipents = await this.fetchRecipents()
        for (let i = 0; i < recipents.columns.length; i++) {
            if( recipents.columns[i] == "tags") this.setState({tagsIndex: i});
            
        }
        this.setState({
            recipents: recipents,
            
        })
    }
    async fetchRecipents (){
        const res = await fetch("/recipents/get")
        const recipents = await res.json()
        console.log(recipents)
        return recipents
    }
    onRecipentSelected (i){
        this.setState({
            selectedRecipent:this.state.recipents.parsed[i]
        })
    }
    onImportRecipentShown(){
        
    }
    render() {
        return (
            <div>
                <h1>Recipents</h1>
                <div style={{width:"100%", height:"50px"}}>
                    <button className="btn btn-primary m-1">Add Recipent</button>
                    <button data-bs-toggle="modal" data-bs-target="#modal-import-recipent-csv" onClick={this.onImportRecipentShown.bind()} className="m-1 btn btn-primary">Import Recipents</button>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        <RecipentsList tagsIndex={this.state.tagsIndex} onRecipentSelected={this.onRecipentSelected.bind(this)} recipents={this.state.recipents}/>
                    </div>
                    <div className="col-md-3" >
                        <RecipentEditor recipent = {this.state.selectedRecipent}/>
                    </div>
                </div>
                <ImportCSVModal id="modal-import-recipent-csv"/>
            </div>
        )
    }
}
