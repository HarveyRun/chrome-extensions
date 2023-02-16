
//这个文件需要通过修改文件名称来重新加载新的代码

//修改本文件后需要改动三个地方 1: 本文件文件名称  2: package.json => manifest.web_accessible_resources字段 => content-X文件的引入路径

//拦截任意网站XHR或fetch请求
(function(){
    window.$$injected = "v2.3.1";
})();
(function (xhr) {

    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function (postData) {
        this.addEventListener('load', function () {
            //sessionStorage['key']  // 插件需要添加'storage'权限
            window.postMessage({ type: 'xhr', base:this._url,  data: this.response }, '*');  // 将响应发送到 content script
        });
        return send.apply(this, arguments);
    };

})(XMLHttpRequest);


(function () {
    let origFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await origFetch(...args);
        response.clone().json().then(data => {
            window.postMessage({ type: 'fetch', base:args[0], data: data }, '*');
        }).catch(err => console.log("Sorry,"));
        return response;
    }
})();

