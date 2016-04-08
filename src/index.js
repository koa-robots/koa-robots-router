import fs from 'co-fs'
import pathToRegexp from 'path-to-regexp'
import {join, normalize, resolve} from 'path'

export default function(root = '.', options = {}){
    root = normalize(resolve(root))
    options.routes = clone(options.routes || [])

    options = Object.assign({
        routes : null,
        index : '/index'
    }, options)

    for(let route of options.routes){
        route.url = pathToRegexp(route.url)
    }

    return function *(next){
        for(let route of options.routes){
            let matched, params

            if(this.path === '/'){
                break
            }

            if(!(matched = route.url.exec(this.path))){
                continue
            }

            params = {}
            matched = matched.slice(1)
            route.url.keys.forEach((item, index) => {
                params[item.name] = matched[index]
            })

            this.params = params
            this.path = route.controller
            break
        }

        if(this.params){
            if(!this.state.renderData){
                this.state.renderData = {}
            }

            Object.assign(this.state.renderData, this.params)
        }

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

function clone(obj){
    return JSON.parse(JSON.stringify(obj))
}
