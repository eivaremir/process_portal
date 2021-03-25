import Button from "./Button.js"

let Buttons = ({onAction}) => {
    return (
        <div className='buttons'>
            <Button dataType='number' dataAction='1' onAction={onAction} label='1' />
            <Button dataType='number' dataAction='2' onAction={onAction} label='2' />
            <Button dataType='number' dataAction='3' onAction={onAction} label='3' />
            <Button dataType='operation' dataAction='/' onAction={onAction} label='/' />
            <Button dataType='number' dataAction='4' onAction={onAction} label='4' />
            <Button dataType='number' dataAction='5' onAction={onAction} label='5' />
            <Button dataType='number' dataAction='6' onAction={onAction} label='6' />
            <Button dataType='operation' dataAction='*' onAction={onAction} label='*' />
            <Button dataType='number' dataAction='7' onAction={onAction} label='7' />
            <Button dataType='number' dataAction='8' onAction={onAction} label='8' />
            <Button dataType='number' dataAction='9' onAction={onAction} label='9' />
            <Button dataType='operation' dataAction='+' onAction={onAction} label='+' />
            <Button dataType='dot' dataAction='.' onAction={onAction} label='.' />
            <Button dataType='number' dataAction='0' onAction={onAction} label='0' />
            <Button dataType='' dataAction='del' onAction={onAction} label='del' />
            <Button dataType='operation' dataAction='-' onAction={onAction} label='-' />
        </div>
    )
}

export default Buttons