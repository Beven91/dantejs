/**
 * 名称:链尚基础API主入口
 */

//公布引用
module.exports = {
    Base: require('./base/base.js'),
    Type: require('./base/type.js'),
    String: require('./base/string.js'),
    Date: require('./base/date.js'),
    Array: require('./base/array.js'),
    Fn: require('./base/function.js'),
    Number: require('./base/number.js'),
    List: require('./base/list.js'),
    BrowserVersion: require('./extension/browser.js'),
    CookieParser: require('./extension/cookie.js'),
    UrlParser: require('./extension/urlparser.js'),
    EventEmitter: require('./extension/emitter.js'),
    Timer: require('./extension/timer.js'),
    Promise: require('./extension/promise.js'),
    QueuePool: require('./extension/pool.js'),
    Validator: require('./extension/validator.js')
}