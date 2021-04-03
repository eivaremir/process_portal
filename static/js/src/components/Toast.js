
export default class Toast extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){

    }
    render() {
        return (
            <div id={this.props.id} className={`toast ${this.props.textColor} ${this.props.bgColor}`}>
                {this.props.title!="" && <div className="toast-header">
                    <img src={this.props.image_url} className="rounded me-2" alt="..."/>
                    <strong className="me-auto">{this.props.title}</strong>
                    <small>{this.props.hright}</small>
                </div>}
                <div className="d-flex">
                <div className="toast-body">
                    {this.props.message}
                    
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        )
    }
}
/*
function Toast({textColor, bgColor,image_url,title,hright,message,id}) {
    return (
        <div id={id} className={`toast ${textColor} ${bgColor}`}>
            <div className="toast-header">
                <img src={image_url} className="rounded me-2" alt="..."/>
                <strong className="me-auto">{title}</strong>
                <small>{hright}</small>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    )
}*/
Toast.defaultProps = {
    textColor:"text-white",
    bgColor:"bg-primary",
    image_url: "",
    title:"",
    hright: "Time",
    message: "Input your message here"
}
/*
Toast.propTypes={
    
    textColor:PropTypes.string,
    bgColor:PropTypes.string,
    image_url:PropTypes.string,
    title:PropTypes.string,
    hright:PropTypes.string,
    message:PropTypes.string,
}
*/