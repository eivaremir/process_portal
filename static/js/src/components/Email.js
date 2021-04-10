
import EmailMainNav from './Email/EmailMainNav.js'
import EmailCreator from './Email/EmailCreator.js'
import EmailNavigator from './Email/EmailNavigator.js'


function Email() {
    const [showCreate, setshowCreate] = React.useState(false)

    const onShowCreate = ()=> {setshowCreate(!showCreate)}
    
    return (
        <div>
            
            
            
            {!showCreate && 
            (<>
                <h1>Emails</h1>
                <EmailMainNav onCreate={()=>setshowCreate(!showCreate)}/>

                <EmailNavigator />

                

                
            </>)}
            {showCreate && <div className="col-md-12">
                <EmailCreator onGetBack={()=>setshowCreate(!showCreate)}/>
            </div> }
        </div>
    )
}

export default Email
