import View from './View.js'
import Buttons from './Buttons.js'


function Calculator() {
    
    const [expression, setExpression] = React.useState('')
    const [res, setRes] = React.useState(0)
    
    React.useEffect(()=>{
        try{
            setRes(eval(expression))
        }
        catch(ex){
            //console.log(ex)
        }
    },[expression])

    const onAction= (e)=>{
        //e.preventDefault()
        // write expression
        if (e.target.dataset.type === 'number' || e.target.dataset.type === 'operation' || e.target.dataset.type === 'dot'){
            console.log(e.target.dataset.action)
            setExpression(expression+e.target.dataset.action)
        }
        if(e.target.dataset.action =='del'){
            setExpression(expression.slice(0,expression.length-1))
        }

        // calculate expression
        //if (e.dataset.type === 'number'){
            //console.log('calculating...')
            //
        //}

    }


    return (
    <div className='calculator'>
        <View res={res ? res : 0} expression={expression?expression:0}/>
        <Buttons onAction={onAction} />
      </div>
    )
}

export default Calculator
