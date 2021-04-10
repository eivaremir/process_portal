
import EmailList from './EmailList.js'
import EmailSESDailyLimit from './graphs/EmailSESDailyLimit.js'
function EmailNavigator() {
    return (
        <div className="row mt-2">
        <section>
            
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="statistics-tab" data-bs-toggle="tab" data-bs-target="#statistics" type="button" role="tab" aria-controls="statistics" aria-selected="true">Statistics</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="email-list-tab" data-bs-toggle="tab" data-bs-target="#email-list" type="button" role="tab" aria-controls="email-list" aria-selected="false">List</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="queue-tab" data-bs-toggle="tab" data-bs-target="#queue" type="button" role="tab" aria-controls="queue" aria-selected="false">Queue</button>
                </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="statistics" role="tabpanel" aria-labelledby="statistics-tab">

                    <div className="col-md-12 graphs">
                        <div className="col-md-3">
                            <EmailSESDailyLimit />
                        </div>
                        
                    </div>


                </div>
                <div class="tab-pane fade" id="email-list" role="tabpanel" aria-labelledby="email-list-tab">
                    <div className="col-md-12">
                        <EmailList />
                    </div>
                </div>
                <div class="tab-pane fade" id="queue" role="tabpanel" aria-labelledby="queue-tab">3</div>
                </div>
        </section>
        </div>
    )
}

export default EmailNavigator
