//假如当前 Url 是 http// www. liangshunet. com/pub/item.aspx?t=osw7，则截取到的相对路径为：/pub/item.aspx
function getUrlRelativePath(){
  var url = document.location.toString();
  var arrUrl = url.split("//");

  var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

  if(relUrl.indexOf("?") != -1){
    relUrl = relUrl.split("?")[0];
  }
  return relUrl;
}


/**
 * 传入对象返回url参数
 * @param {Object} data {a:1}
 * @returns {string}
 */
function getParam(data){
    let url = '';
    for(var k in data){
        let value = data[k] !==undefined ? data[k] : '';
        url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
}

/**
 * 将url和参数拼接成完整地址 getUrl("http://nodejs.cn",{a:1}); //http://nodejs.cn?a=1
 * @param {string} url url地址
 * @param {Json} data json对象
 * @returns {string}
 */
function getUrl(url, data){
    //看原始url地址中开头是否带?，然后拼接处理好的参数
    return url += (url.indexOf('?') < 0 ? '?' : '') + getParam(data)
}

//获取url中任意参数值
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
 }

export default {
  pathName: getUrlRelativePath,
  createUrl: getUrl,
  getQueryString: getQueryString
}