import axios from "axios"
import g from "../../config/yaml"

//根据id查找分销课程
function getMatchsData(data) {
	  return axios.get(`${g.dev}/api/Rebate/course-info`, {
	    params: {
	      courseIds: data.courseIds
	    }
	  }).then((response)=>{ return response})
}

//发送订单唯一标识openId
function fireOrderId(data) {
	  return axios.get(`${g.dev}/api/Rebate/order`, {
	    params: {
	      openId: data.id
	    }
	  }).then((response)=>{ return response})
}

function postExp(data) {
	  return axios.post(`${g.dev}/api/Rebate/course-info`, data).then((response)=>{ return response})
}

export default {
	getMatchsData: getMatchsData,
	postExp: postExp,
	fireOrderId: fireOrderId
};