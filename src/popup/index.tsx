import React, { useState } from "react"
import { Button,Divider } from 'antd'; 
import { 
  RedditOutlined,
  HeartTwoTone,
  AliwangwangOutlined,
  SkypeOutlined,
  TaobaoCircleOutlined,
  WindowsOutlined,
  SlackOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

import './style.css'

class IndexPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showText: "" };
    this.hanndleHref = this.hanndleHref.bind(this);
    this.pureLocationOpen = this.pureLocationOpen.bind(this);
  }

  componentDidMount(){
    
  }

  pureLocationOpen(str){
     window.open(str,"_blank");
  }

  hanndleHref(e,type){
    switch (type) {
      case 1:
        this.pureLocationOpen("https://ke.qq.com/");
        break;
      case 2:
        this.pureLocationOpen("https://study.163.com/");
        break;
      case 3:
        this.pureLocationOpen("https://www.icourse163.org/");
        break;
      case 4:
        this.pureLocationOpen("https://www.alimama.com/");
        break;
      case 5:
        this.pureLocationOpen("https://www.jd.com/");
        break;
      case 6:
        this.pureLocationOpen("https://www.taobao.com/");
        break;
      default:
        console.log(`Sorry, we are out of Error.`);
    }
  }
  
  render() {

    let warpStyle = {
       width: "400px",
       height: "200px",
       backgroundColor: "#efefef"
    }

    //腾讯课堂
    //网易云课堂
    //中国大学MOOC

    return (
       <div style={ warpStyle }>
        <div className="headStyle">
          <RedditOutlined className="logoIconStyle"/>
        </div>
        <div className="contentStyle">
           <Button type="primary" size="middle" className="cw" style={{ backgroundColor: "#1c7af7" }} onClick={ (e)=>this.hanndleHref(e,1)}><YoutubeOutlined />腾讯课堂</Button>
           <Button type="primary" size="middle" className="cw" style={{ marginLeft: "15px", backgroundColor: "#f4b400" }} onClick={ (e)=>this.hanndleHref(e,2)}><SkypeOutlined />网易云课堂</Button>
           <Button type="primary" size="middle" className="cw" style={{ backgroundColor: "#15c39a" }} onClick={ (e)=>this.hanndleHref(e,3)}><LinkedinOutlined />中国大学MOOC</Button>
           <Button type="primary" size="middle" className="cw" style={{ marginLeft: "15px", backgroundColor: "#fc5531" }} onClick={ (e)=>this.hanndleHref(e,4)}><SlackOutlined />阿里妈妈</Button>
           <Button type="primary" size="middle" className="cw" style={{ backgroundColor: "#e71515" }} onClick={ (e)=>this.hanndleHref(e,5)}><AliwangwangOutlined />京东</Button>
           <Button type="primary" size="middle" className="cw" style={{ marginLeft: "15px", backgroundColor: "#4391f1" }} onClick={ (e)=>this.hanndleHref(e,6)}><TaobaoCircleOutlined />淘宝</Button>
        </div>
        <div className="footStyle">
           <div className="fspin"><WindowsOutlined /> 设置</div>
           <div className="fspin"><QuestionCircleOutlined /> 使用教程</div>
        </div>
       </div>
    )
  }
}

export default IndexPopup
