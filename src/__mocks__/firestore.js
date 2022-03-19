export default {
  bills(){
    return {
      add(bill){
        return new Promise((resolve)=>{
          resolve()
        })
      }
    }
  },
  storage: {
    ref(filename) {
      return {
        put(file){
          return new Promise((resolve) => {
            resolve({
              ref: {
                getDownloadURL() {
                  return 'url'
                }
              }
            })
          })
        }
      }
    }
  }
}