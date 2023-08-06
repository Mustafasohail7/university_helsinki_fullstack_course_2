const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(...params)
    }else{
      console.log('test mode',...params)
    }
  }
  
  const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(...params)
    }else{
      console.log('test mode',...params)
    }
  }
  
module.exports = {
    info, error
}