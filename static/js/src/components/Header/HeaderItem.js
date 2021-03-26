const HeaderItem = ({onClick,text}) => {
    return (
        <li>
            <span onClick={onClick}>{ text }</span>
        </li>
    )
}
HeaderItem.defaultProps ={
    //onClick : ()=> {console.log("onClick prop is pending")},
    text: "Header Item"
}
export default HeaderItem