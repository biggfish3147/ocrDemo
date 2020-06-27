# fetch发送POST请求报错
```
err TypeError: Network request failed
    at EventTarget.xhr.onerror (C:\CodeLife\reactproject\ocrDemo\node_modules\whatwg-fetch\dist\fetch.umd.js:473)
    at EventTarget.dispatchEvent (C:\CodeLife\reactproject\ocrDemo\node_modules\event-target-shim\dist\event-target-shim.js:818)
    at EventTarget.setReadyState (C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\Network\XMLHttpRequest.js:575)
    at EventTarget.__didCompleteResponse (C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\Network\XMLHttpRequest.js:389)
    at C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\Network\XMLHttpRequest.js:502
    at RCTDeviceEventEmitter.emit (C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\vendor\emitter\EventEmitter.js:189)
    at MessageQueue.__callFunction (C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\BatchedBridge\MessageQueue.js:425)
    at C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\BatchedBridge\MessageQueue.js:112
    at MessageQueue.__guard (C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\BatchedBridge\MessageQueue.js:373)
    at MessageQueue.callFunctionReturnFlushedQueue (C:\CodeLife\reactproject\ocrDemo\node_modules\react-native\Libraries\BatchedBridge\MessageQueue.js:111)
```

# 问题定位

通过系列测试，明确问题：
1. 接口没问题，通过postman或浏览器网址能够正常访问（本地开发服务器的接口/阿里云服务器上暴露的接口）
2. GET请求没问题，无论请求URI是http或https
3. POST请求始终报上述错误。

# 附属知识
1. 在向后端请求时，如果上传的数据里存在file文件对象，需要用到表单提交，这时候我们需要将JSON对象，转成formData对象

# 解决方案

本地调试[端口映射](https://blog.csdn.net/omnispace/article/details/80018734?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)

## 小阶段成果：
上传json字符串，post请求能够成功。原因在于body中的数据类型，必须是字符串化。不能是json对象或者fromData对象

## GET请求远程服务器
通过get请求方式请求福林服务器，能够正常获得返回值。

## 解决
参考React Native 仓库的[issue](https://github.com/facebook/react-native/issues/28551)


