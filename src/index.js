import fs from 'co-fs'
import router from 'koa-router'
import {join, isAbsolute} from 'path'
import routes from '../resources/routes'

export default function(app, routerInstance = router()){
    routes(routerInstance)
    app.use(routerInstance.routes())
    app.use(routerInstance.allowedMethods())

    return function(root = '', opts = {index : '/index'}){
        root = toAbsolutePath(root)

        return function *(next){
            let filePath = join(root, (this.path === '/' ? opts.index : this.path) + '.js')

            if(yield fs.exists(filePath)){
                yield _interopRequireDefault(require(filePath)).default().call(this, next)
            }

            yield next
        }
    }
}

function toAbsolutePath(path){
    return isAbsolute(path) ? path : join(process.cwd(), path)
}

function _interopRequireDefault(obj){
    return obj && obj.__esModule ? obj : {default: obj}
}
