export default function(){
    return function *(){
        this.body = `${this.params.category} ${this.params.title}`
    }
}
