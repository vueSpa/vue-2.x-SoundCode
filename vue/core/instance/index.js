import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)        // 实例化方法集合
stateMixin(Vue)       // 属性状态实例化
eventsMixin(Vue)      // 事件实例化
lifecycleMixin(Vue)   // 生命周期 实例化
renderMixin(Vue)      // 模版渲染 方法集合

export default Vue
