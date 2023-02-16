import type { PlasmoCSConfig } from "plasmo"
import txApis from '../api/tx/index'
import utils from "../utils/tools"

let { getMatchsData,fireOrderId } = txApis;

export const config: PlasmoCSConfig = {
  matches: ["https://ke.qq.com/*"]
};

//注入监听http请求的代码
{
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('lib/injectedxz.js');
    s.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}

//监听http请求
window.addEventListener('message', function (e) {
    if(!e.data.base || typeof e.data.base != 'string') {
        console.log("请求路径错误");
        return;
    };
    
    //首页
    if(e.data.base.indexOf("web_home_course") !== -1 || e.data.base.indexOf("get_user_browser") !== -1){
        // dispatchBusiess(e.data,1);
        //直接跳转搜索页面（首页推荐的商品都是热销的，很难遇见分销商品）
        window.location.href = "https://ke.qq.com/course/list"
    }
    //分类列表
    if(e.data.base.indexOf("course_list") !== -1){
        dispatchBusiess(e.data,2);
    }
    //商品详情
    if(e.data.base.indexOf("get_course_detail") !== -1){
        dispatchBusiess(e.data,3);
    }
    
});

window.addEventListener("load", () => {
    
    //fixbug-2912 Unable to monitor http for the first time loaded
    let path = utils.pathName();
    if(path.indexOf("#term_id") !== -1){
        appendDom([]);
    }
    if(path.indexOf("user/purchase") !== -1){
        appendPayDescriptDom();
    }
})

function matchesData(data,ids){
    //获取分销商品列表
    let params = {
       courseIds: ids
    }
    getMatchsData(params).then((res)=>{
        chrome.storage.local.set({ cacheResult: res.data.items }).then(() => {
           console.log("缓存成功");
           appendDom(data,res.data.items);
        });

    });
}


function dispatchBusiess(data,type){
    //1: 首页列表 2:分类列表  
    let json , ids = [];
    if(type == 1){
        json = data.data && data.data.result && data.data.result.web_course_items;
        for(var i=0;i<json.length;i++){
            let cid = (json[i].web_home_courses && json[i].web_home_courses.course_id) || 0;
            ids.push(cid);
        }
        let idsToString = ids.join();
        matchesData(data,idsToString);
    }
    if(type == 2){
        json = data.data && data.data.result && data.data.result.search_result;
        for(var i=0;i<json.length;i++){
            let cid = (json[i].course && json[i].course.cid) || 0;
            ids.push(cid);
        }
        let idsToString = ids.join();
        matchesData(data,idsToString);
    }
    if(type == 3){
        let idsToString = [234134].join(); //随便写的
        matchesData([],idsToString);
    }
    
}


//首页列表&分类列表
function appendListDom(platformData,data,type){

    function packageData(source,sdata){
        var result = [];
        for(var i=0;i<source.length;i++){
            var temp = {} , flag = true;
            for(var j=0;j<sdata.length;j++){
                var cid = sdata[j].courseId;
                if(source[i].course && source[i].course.cid == cid){
                    temp['ratePirce'] = sdata[j].rebatePrice;
                    temp['index'] = i;
                    result.push(temp);
                    flag = false;
                    break;
                }
            }
            if(flag){
                temp['ratePirce'] = 0;
                temp['index'] = i;
                result.push(temp);
            }
        }
        return result;
    }

    //首页 => 暂留此逻辑
    function packageDataHome(source,sdata){
        var result = [];
        for(var i=0;i<source.length;i++){
            var temp = {} , flag = true;
            for(var j=0;j<sdata.length;j++){
                var cid = sdata[j].courseId;
                if(source[i].web_home_courses && source[i].web_home_courses.course_id == cid){
                    temp['ratePirce'] = sdata[j].rebatePrice;
                    temp['index'] = i;
                    result.push(temp);
                    flag = false;
                    break;
                }
                     
            }
            if(flag){
                temp['ratePirce'] = 0;
                temp['index'] = i;
                result.push(temp);
            }
        }
        return result;
    }

    var  pJson , diffResult, foter = document.getElementsByClassName("kc-coursecard-footer-left");

    //首页
    if(type == 1){
        pJson = platformData.data.result.web_course_items;
        diffResult = packageDataHome(pJson,data);
    }
    //分类
    if(type == 2){
        pJson = platformData.data.result.search_result;
        diffResult = packageData(pJson,data);
    }
    
    for(var k=0;k<foter.length;k++){
        if(diffResult[k]['ratePirce'] != 0){

            {
                var ele =document.createElement("span");
                ele.textContent= "立返￥" + diffResult[k]['ratePirce'];
                ele.style.cssText = 'width:86px;height:20px;display:inline-block;font-size:12px;background:#ff7a38;border-radius:24px;text-align:center;margin-left:10px;font-weight:bold;color:#fff;'
            }

            foter[k].append(ele);
        }

    }
}

//商品详情
function appendDescriptDom(){

    var btn = document.getElementsByClassName("institution-btn-txt")[0],
        btnCopy = document.getElementsByClassName("institution-btn-txt")[1];

    chrome.storage.local.get(["cacheResult"]).then((result) => {

        var cid = parseInt(window.location.pathname.replace(/[^0-9]/ig,""));
        var price = findIdGood(result.cacheResult,cid).rebatePrice || 0;
        btn.innerHTML = "立返￥" + price + "&nbsp;&nbsp;&nbsp;立即购买";
        btnCopy.innerHTML = "立返￥" + price + "&nbsp;&nbsp;&nbsp;立即购买";

        // parent是需要添加元素的容器，newEle是新添加的元素, oldEle是添加在哪个元素之前
        // parent.insertBefore(newEle, oldEle);

    });
    
}

//支付详情
function appendPayDescriptDom(){
    
    chrome.storage.local.get(["cacheResult"]).then((result) => {

        var priceDescript = document.getElementsByClassName("purchase-bottom-content")[0];
        var json = result.cacheResult;
        var cid = utils.getQueryString("courseId");
        var ratePrice;
        for(var p=0;p<json.length;p++){
            if(cid == json[p].courseId){
                ratePrice = json[p].rebatePrice
                break;
            }
        }

        {
            var ele =document.createElement("div");
                ele.classList.add("purchase-bottom-rows");

            var html = '<p style="color:red;font-weight:bold;" class="purchase-bottom-label">返现金额</p><p class="purchase-bottom-right">¥'+ratePrice+'</p>';
            ele.innerHTML = html;
                
        }

        priceDescript.appendChild(ele);
    });
    
}

function appendDom(platformJson,data){
    let pageType = identifyPage();
    switch (pageType) {
      case 1:
        appendListDom(platformJson,data,1);
        break;
      case 2:
        appendListDom(platformJson,data,2);
        break;
      case 3:
        chrome.storage.local.get(["cacheResult"]).then((result) => {
            var cid = parseInt(window.location.pathname.replace(/[^0-9]/ig,""));
            var fix = document.location.href.split("#term_id=");
            var link = findIdGood(result.cacheResult,cid).courseLink;
            var linkSplit = link.split("?");
            var newUrl = linkSplit[0]+"#term_id="+fix[1]+"?"+linkSplit[1];
            history.pushState('','',newUrl);
            appendDescriptDom();
        });
        break;
      case 4:
        appendPayDescriptDom();
        break;
      case 5:
        console.log("pay price page");
        break;
      default:
        console.log(`Sorry, we are out of error }.`);
    }
}

function identifyPage(){
    let path = utils.pathName();
    //1:首页：https://ke.qq.com/
    //2:分类列表页：https://ke.qq.com/course/list?mt=1004&st=2027&tt=3245&quicklink=1
    //3:详情页：https://ke.qq.com/course/4156787#term_id=104312601
    //4:支付详情页：https://ke.qq.com/user/purchase/purchase.html?cid=359017&courseId=359017&termId=106135179
    //5:支付页：https://pay.qq.com/enterprise/separate.shtml?transaction_id=E-230215100243287668&token_id=E-230215100243287668&
    return  path.indexOf("course/list") !== -1 ? 2 : 
            path.indexOf("#term_id") !== -1 ? 3 : 
            path.indexOf("user/purchase") !== -1 ? 4 :
            path.indexOf("separate.shtml") !== -1 ? 5 : 1;
}

//https://pay.qq.com/enterprise/separate.shtml?transaction_id=E-230216130248815062&token_id=E-230216130248815062&pf=midas_group_pay-1000-pc-1000&out_trade_no=GP7031855008278761472&extinfo=%7B%22backUrl%22%3A%22https%3A%2F%2Fke.qq.com%2Fcourse%2F207953%3Fplatform%3D1%26pay_succ%3D1%23term_id%3D105784360%22%2C%22guideUrl%22%3A%22%2F%2Fke.qq.com%2Fmidas.html%22%2C%22native_wxpay%22%3Atrue%7D&appid=1450008443&type=UNL&timestamp=1676524879952&session_id=hy_gameid&session_type=st_dummy&openid=144115377668292762&openkey=nopwd&allowchannels=wechat&nformat=1
//out_trade_no 商品订单号
//token_id 支付订单号
//open_id  openId
function findIdGood(data,id){
    for(var i=0;i<data.length;i++){
        if(id == data[i].courseId){
            return data[i];
        }
    }
}



