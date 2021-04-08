import EmailList from './Email/EmailList.js'
import EmailMainNav from './Email/EmailMainNav.js'
import EmailCreator from './Email/EmailCreator.js'
function Email() {
    const [showCreate, setshowCreate] = React.useState(false)

    const onShowCreate = ()=> {setshowCreate(!showCreate)}
    return (
        <div>
            
            
            
            {!showCreate && 
            (<>
                <h1>Emails</h1>
                <EmailMainNav onCreate={()=>setshowCreate(!showCreate)}/>

                <div className="col-md-12">
                    <EmailList />
                </div>
            </>)}
            {showCreate && <div className="col-md-12">
                <EmailCreator onGetBack={()=>setshowCreate(!showCreate)}/>
            </div> }
        </div>
    )
}

export default Email
