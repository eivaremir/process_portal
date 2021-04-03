import RecipentsList from './RecipentsView/RecipentsList.js'
import RecipentEditor from './RecipentsView/RecipentEditor.js'
import ImportCSVModal from './Modal/ImportCSVModal.js'
export default class RecipentsView extends React.Component {

    onImportRecipentShown(){
        
    }
    render() {
        return (
            <div>
                <h1>Recipents</h1>
                <div style={{width:"100%", height:"50px", border:"1px solid black"}}>
                    <button className="btn btn-primary">Add Recipent</button>
                    <button data-bs-toggle="modal" data-bs-target="#modal-import-recipent-csv" onClick={this.onImportRecipentShown.bind()} className="btn btn-primary">Import Recipents</button>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <RecipentsList />
                    </div>
                    <div className="col-md-6">
                        <RecipentEditor />
                    </div>
                </div>
                <ImportCSVModal id="modal-import-recipent-csv"/>
            </div>
        )
    }
}
