本文主要讲三个 问题

1. prototype 和 __proto__
2. function 和 object
3. new 到底发生了什么

### prototype 和 __proto__

    首先我们说下在 JS 中，常常让我们感到困惑的地方，就是 prototype 和 __proto__ 到底是干嘛的

    1. __proto__ 就是 Javascript中  所谓的原型 （这里，我们还是拿具体的例子来说明吧）

```javascript
    function A (name) {         // 这里是一个构造函数
        thia.name = name
    }
    
    var Aobj = {                // 这里是一个 对对象字面量
        name: ''
    }
    
    // 我们分别打印出来这二个对象看看
    console.dir(A)
    
    console.dir(Aobj)

```
![](http://images2015.cnblogs.com/blog/675289/201703/675289-20170311125257467-187518383.png)


    这里我们可以很明显的看到 
    构造函数的  __proto__ 属性 指向了 function()

    对象字面量的  __proto__ 属性 指向了 Object

    为什么 指向的 是不一样的呢？

    思考下:

    确实是 不一样的， 因为 构造函数本身也是一个 函数， 所以它 的原型 指向  function() 

    而对象字面量 是一个 对象， 那么他的 原型肯定是指向  Object

    扩展思考，如果 是一个数组 对象， 那么它的   __proto__  会指向什么呐？

```javascript
    const arr = [112,22,3333] 
    console.dir(arr)
```

![](http://images2015.cnblogs.com/blog/675289/201703/675289-20170311133751811-1547361806.png)

    没错， 这里的  __proto__ 就指向了 Array[0]




    总结 ：一个对象的 __proto__ 属性和自己的内部属性[[Prototype]]指向一个相同的值 (通常称这个值为原型)

    tips：firefox、chrome等浏览器把对象内部属性 [[Prototype]] 用 __proto__ 的形式暴露了出来.(老版本的IE并不支持 __proto__ ,IE11中已经加上了 __proto__ 属性)


    2.  prototype : 看看上面的 截图，你会发现 只有 构造函数 中 有这个玩意儿，  对的。 prototype 确实 是 在 function 中特有的。 别的对象类型中 都不会有的属性。


![](http://images2015.cnblogs.com/blog/675289/201703/675289-20170311135330029-880878106.png)

    我们在看这个 function 对象属性的 时候就会发现这么一个 prototype 的属性，它的值是 一个 Object 。 点开这个 obj 我们就会发现啊， 这个 obj 的constructor 属性 指向了 这个构造函数本身。 是不是很神奇，至于为什么会是这样子的。

    留一个 思考题吧， 为什么在 javascript 中，函数对象的 prototype 属性的 constructor 指向是 函数本身？

    （在下面的介绍中，我们会 回答到这个问题）


### function 和 object

    同样，我们来先看一个例子。

```javascript

    function B(name) {
        this.name = name
        this.getName = function() {
            console.log(this.name)
        }

        var c = 'test'
        console.log(c)
    }

    var b = new B('testb')      // test
    console.log(b)              // B: { name: 'testb',getName: function() {} }
    B('testc')                  // test
```

    看到上面的 输出 是不是觉得又很诧异了。
    确实， 为什么 在 new 的时候， 构造函数居然 执行了一次。

    同样， 在非严格模式下， 我们直接执行 构造函数， B('testc') 相当于：

```javascript

    // window.name = 'testc'
    // window.getName = function() { console.log(this.name) }

```

    思考： 
    我们的函数B既可以直接执行,又可以new一下返回一个对象。function和object到底是什么关系,new的时候发生了什么?

### new 到底发生了什么

    还是上面的 问题， 当我们执行 var b = new B('testb') 的时候发生了什么？

    MDN 上的介绍是这样的说的：

    对于 var b = new B('testb')

```javascript

//  javascript 实际上执行的是：

var o = new Object()   // 生成一个 新的 对象  b 这里 可以约等于  var b = {}

o.__proto__ = B.prototype // 这里就是 函数对象中 独有的 prototype 属性。

                          // 这个独有的 prototype 属性 包含了一个 constructor 属性方法，指向的就是 构造函数， 也就是 这里的  function B(name) {}

B.call(o)                 // tips :这里 就需要注意了，因为很多同学都搞不清楚 这里是什么意思。
                          
                          // 由于 call 的使用 将这里this是指向o, 所以就 可以 把什么this.name/getName 强行的绑定到o上。同时，需要注意的一点就是， 这里的 构造函数 执行科一遍， 只不过是 将 this 指向的 属性和方法，都 强行的 给 新创建的  这个 o 对象 绑定了一遍。

var b = o                 // 把 这个 o 返回给了  b 。 从而完成了  var b = new B('testb') 的过程

// 如果 还是不明白是 什么意思的话。 我们来看看  call 是干嘛用的 

```

```javascript
    // 关于 call 的使用说明 

    var o1 = {
        name: '111',
        getName: function() {
            console.log(this.name)
        }
    }

    var o2 = {
        name: '222'
    }

    o1.getName.call(o2)  // 222
```


    所以 这个时候，我们反过头来 看看  这个 new 的对象都有哪些 属性 和方法。

    我们 可以 来 做一个 小实验，来 证明下，我们以上所说的东西。

```javascript

function A (name) {         // 这里是一个构造函数
    this.name = name
}

var o = {}
o.__proto__ = A.prototype
A.call(o)
var a = o

var b = new A()

console.log(a)
console.log(b)

```    
![](http://images2015.cnblogs.com/blog/675289/201703/675289-20170311162654873-1613930357.png)


    果然 和 我们想象 的一模一样。 
    
    至于 js 为什么要 把 新建 对象的 原型 指向 构造函数的 prototype 属性。

    我们可以这样来理解。 因为 通过 new 方法来创建的  obj 。肯定是需要 一个 标记 来找到自己的 构造器函数。
    所以 为了让 整个 程序结构看上去 合理。 我们需要   把 新建 对象的 原型 指向 构造函数的 prototype 属性。



`
所以到最后，我们 总结一下 。 

在 javascript 中 prototype 和 __proto__ 到底有什么区别。

prototype 是 面向 构造函数，来思考，
__proto__ 是 面向 实例化 后 的对象 来思考就对了。 

`

`
最后再 给一个例子，
是一个，我们经常会在开发中用到的 例子。
`

```javascript
var Person = function(){}
Person.prototype.sayName = function() {
    alert('my name is xxx')
}

Person.prototype.age = 12

var p = new Person()

p.sayName()

// 当我们 实例化 之后， 在我们 去执行 p.sayName() 的 时候，我们就会去 this 内部去 查找（这里就是 构造函数 Person 内部去找。 可是 没找到啊。只是一个 空函数， 怎么办呢？）

// 这个时候 就会沿着 原型链向上追溯， 但是如何 追溯呢？

// 这里就要用到 __proto__ 属性 来作为 追溯的 桥梁。

// 因为 实例化对象的 __proto__ 属性 指向的就是 构造函数的  prototype 属性所对应的 对象啊

```


![](http://images2015.cnblogs.com/blog/675289/201703/675289-20170311172017998-131500932.png)


最后 终于 愉快的 找到了，自己的对象啦~ 单身狗就可能一直找不到，或者看不懂这篇文章。



好了，以上就是 在 看 vuejs 源码 的时候 关于 new 的 一个 知识 扩展。
