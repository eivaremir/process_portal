import RecipentsList from './RecipentsView/RecipentsList.js'
import RecipentEditor from './RecipentsView/RecipentEditor.js'

export default class RecipentsView extends React.Component {
    render() {
        return (
            <div>
                <h1>Recipents</h1>
                <div style={{width:"100%", height:"50px", border:"1px solid black"}}>
                    <button className="btn btn-primary">Add Recipent</button>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <RecipentsList />
                    </div>
                    <div className="col-md-6">
                        <RecipentEditor />
                    </div>
                </div>
            </div>
        )
    }
}
