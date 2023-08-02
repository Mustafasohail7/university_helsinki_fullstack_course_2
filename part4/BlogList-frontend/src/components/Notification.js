import './Notification.css'

const Notification = ({message,type}) => {
    if (message === null) {
        return null
    }
    
    console.log(type)
    return (
        <div className={type===0 ? 'error' : 'success'}>
          {message}
        </div>
    )
}

export default Notification
