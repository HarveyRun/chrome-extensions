import type { PlasmoCSConfig } from "plasmo"
import txApis from '../api/tx/index'
import utils from "../utils/tools"

let { fireOrderId } = txApis;

export const config: PlasmoCSConfig = {
  matches: ["https://pay.qq.com/*"]
};

setTimeout(()=>{
	//支付逻辑
	var openId = utils.getQueryString("openid");
	if(openId){
	  	payBusiess();
	}
},3000);

function payBusiess(){
    //发送订单唯一标识
    var openId = utils.getQueryString("openid");
    fireOrderId({ id: openId }).then((res)=>{
        console.log("OPENID FIRE SUCCESS");
    });
}

window.addEventListener("load", () => {})
