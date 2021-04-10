
export default class EmailSESDailyLimit extends React.Component {
    constructor(){
        super()
        this.state = {
            Max24HourSend : 1,
            SentLast24Hours: 0,
            ses_daily_limit: Object
        }
    }
    async getQuota(){
        await fetch("/email/ses/get/send_quota")
        .then((res)=>{return res.json()})
        .then((data)=>{
            this.state.ses_daily_limit.data.datasets[0].data = [data.Max24HourSend-data.SentLast24Hours,data.SentLast24Hours] 
            
            this.state.ses_daily_limit.update()
        })
        /*this.setState({
            Max24HourSend: res.Max24HourSend,
            SentLast24Hours: res.SentLast24Hours
        })*/
        
    }
    componentDidMount(){
       
        var ctx = document.getElementById('ses-daily-limit').getContext('2d');
        
        const config = {
            type: 'doughnut',
            data: {
                labels:['Available','Sent'],
                datasets:[
                    {
                        label:'d1',
                        data:[1,0],
                        backgroundColor:['#36a2eb','black'],
                        borderWidth:0
                    }
                ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Amazon SES daily e-mails'
                }
              }
            },
          };
        
          this.setState({
            ses_daily_limit:new Chart(ctx, config)
          })
          this.getQuota()
        //var ses_daily_limit = new Chart(ctx, config);
    }
    
    render() {
        return (
            <canvas id="ses-daily-limit" width="400" height="400"></canvas>
        )
    }
}
