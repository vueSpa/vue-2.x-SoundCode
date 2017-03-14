### Flow

    本分支的作用就是为了学习 vue 源码所作的铺垫。
    前面的 文章，我们已经开始了 vue 源码 构造函数部分的解读，
    但我们发现，vue 2.x 的源码 居然是用的 flow 来写的。
    所以我们很有必要来认识这个 东东 到底是用来干嘛的

#### 相关学习资料

[flow官方文档-英文版](https://flowtype.org/docs/)

[flow github地址](https://github.com/facebook/flow)

#### flow 基本使用

    install

    npm install flow -g
    (mac 下需要 先进入 root  sodu -i)

    然后 如果 你的 编辑器 刚好和 笔者是一样的 - vscode
    那么 你还需要 给你的 ide 安装一个插件  - flow language vs code

    在重启之后会提示你 您未安装 flow-bin  
    这个时候我们再 把 这个插件 安装一下。

    然后，我们就可以开始愉快的 coding 了


    introduce

    众所周知，js 说一门若类型语言。 类型转换往往隐藏在各种代码中。
    同时也埋下了很多的坑. 虽然目前我们在使用 eslinet 这类与法检测的插件
    但是由于 js 太过于灵活 其实还是很难避免由于 类型转换造成的错误
    所以这个时候 flow 出现了。

#### flow 例子

```javascript

function add(num1, num2) {
    return num1 + num2
}
add(2, '0')     // 20
```

    这种由于 js 这种 若类型 语言的 诟病。
    很多人 可能会 觉得这个是 等于 2
    
    其实 是等于 20 。 这很显然不是我们想要的。

    那么 我们来用 flow 来做个 简单的语法检测

```javascript

/* @flow */

function add(num1, num2) {
    return num1 + num2
}
add(2, '0')     // 20

```



