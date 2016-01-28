export default function(){
    return function *(){
        if(this.params){
            this.body = `${this.params.category} ${this.params.title}`
        }else{
            this.body = 'test'
        }
    }
}
