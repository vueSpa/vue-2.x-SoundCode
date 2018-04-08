### Vue 源码第三步

###  vueJs 源码解析 （三） 具体代码


	在之前的文章中提到了 vuejs 源码中的 架构部分，以及 谈论到了 vue 源码三要素 vm、compiler、watcher 这三要素，那么今天我们就从这三要素逐步了解清楚

	好了，话不多说， let's do it

	在这之前，我们需要 对上文中讲到的 vuejs 的源码是 flow 写法的问题进行一个简化。 毕竟还有有工具是可以解决的。
	
	可以用babel-plugin-transform-flow-strip-types去转化下即可。

```bash
	
1、 npm install --save-dev babel-plugin-transform-flow-strip-types

2、 .babelrc 文件中

{
  "plugins": ["transform-flow-strip-types"]
}
	 
```

> 具体转换方法见 [github地址](https://github.com/erbing/Vue-Code)

##### 一、 instance 实例化入口 核心代码

	/src/core/instance/index.js


```javascript

import { initMixin } from './init'				// 实例化 混合 
import { stateMixin } from './state'			// 各类数据应用 混合
import { renderMixin } from './render'			// render 函数等 混合
import { eventsMixin } from './events'			// 例如 父子组件的 emit on 事件
import { lifecycleMixin } from './lifecycle'	// 这个暂时比较模糊，后面的文章更新
import { warn } from '../util/index'			// warn 报错工具 在控制台经常会看到的 vue 的warn

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&  
    !(this instanceof Vue)             // 这里就是判断当前 this 的 prototype 是否是 Vue
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue

```

##### 一、 instance 实例化入口 核心代码 之 init.js

>核心代码区块一：

```javascript

if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
} else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), 
      options || {}, vm);
}

```

`解析：`
	
	判断传入的值当中是否有组件，如果有则先实例化组件。


>核心代码区块二：

```javascript

    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

```

`解析：`

	看字面上的意思是分别一次 实例化了 生命周期、事件、渲染函数 、回调钩子 ‘beforeCreate’、

	依赖注入、状态、 提供 、回调钩子 ‘created’、

	对，看到这里我们还是很奇怪这些东西是干嘛的？

	那么下面我们继续依次往下看：

> 一、实例化生命周期 initLifecycle

```javascript

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;

```

`看上去是增加了一系列的 属性。但是还是不知道这个有什么用。不着急，我们继续往下看。`

> 二、实例化生命周期 initEvents
	
```javascript

export function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

```

` 再走到这步的时候就会发现， vm.$options  这个对象 频频出现在我们的视野中，如果每次都不能理解的话。就会遇到 理解障碍。 那么 我们就需要 做一个 最简单的测试用例。 （实际的把 vue 跑起来）`

>三、new Vue({ options })  Vue 最简单的测试用例

` 我们在created 钩子下打印 this 对象 部分结果如下 `

	console.log(this)

```javascript
// console.log(this)
_events: {}
_hasHookEvent :false
_inactive :null
_isBeingDestroyed :false
_isDestroyed :false
_isMounted: true
_isVue: true
```

` 这里我们就能够看到比较清晰的一些属性了 在 init.js 中的第一步 initLifecycle.js 中定义的 `

```javascript
// console.log(this)
_events: {}					// 事件对象集合
_hasHookEvent :false		// 是否有钩子事件
_inactive :null				// 未知
_isBeingDestroyed :false	// 是否要销毁
_isDestroyed :false			// 是否已经销毁
_isMounted: true			// 是否已挂载
_isVue: true				// 是否是 Vue 对象
```

` 这里我们就再回到 initLifecycle.js 源码 中去看 `

```javascript
  const options = vm.$options;
  let parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];    //  这里定义的 children  数字对象未知是什么意思
  vm.$refs = {};        //  这里定义的 refs 对象依然未知
```

` 走到这一步 大概对 vm.$options  这个对象 有个初步的了解，但是还有部分依然是未知。好了，我们继续往下走。 `


> 四、 我回到  第二步 实例化生命周期 initEvents

```javascript

export function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

```

`  给 vm 对象 新增了一个 _events  对象 ， 并且会去判断 vm.$options 是否有父级的事件监听。`

```javascript

propsData : undefined
_componentTag : "App"
_parentElm : null
_parentListeners : undefined
_parentVnode : VNode {tag: "vue-component-1-Apps-test", data: {…}, children: undefined, text: undefined, elm: div.test11, …}
_refElm : null
_renderChildren : undefined

```

` _parentListeners 值为空。  这里我们做一个大胆的假设： 是否有组件的引用的时候这个值就会发生改变。 那么下面我们简单的测试下。新增一个基础组件. `

```javascript
// 验证失败：这个值依然还是为 空

// 但是弄清楚了一个问题：

this.$root   				// 为根对象
this.$root.$parent  		// 根对象的 父属性一定是为空
this.$root.$children		// 根对象的 子代属性一定是 一个数组。

// 如果你引用的 组件 
this.$root.$children[0]		// 为第一个组件
this.$root.$children[1]		// 为第二个组件
...

// 以此类推
```

` 好，我们接着往下看 `


> 五、  initRender(vm)

` 第五步： 比较核心的 渲染功能。 `

` 今天先到这里... 先下个班，回家继续整理 `

