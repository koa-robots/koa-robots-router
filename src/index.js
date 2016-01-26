import fs from 'co-fs'
import {join, normalize, resolve} from 'path'

export default function(root = '.', options = {}){
    root = normalize(resolve(root))

    options = Object.assign({
        routes : null,
        index : '/index'
    }, options)

    for(let key in options.routes){
        console.log(key)
    }

    return function *(next){
        let path = join(root, (this.path === '/' ? options.index : this.path) + '.js')
        
        try{
            if((yield fs.stat(path)).isFile()){
                yield _interopRequireDefault(require(path)).default().call(this)
            }
        }catch(err){
            if (~['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].indexOf(err.code)){
                return
            }
        }

        yield next
    }
}

function _interopRequireDefault(obj){
    return obj && obj.__esModule ? obj : {default: obj}
}
