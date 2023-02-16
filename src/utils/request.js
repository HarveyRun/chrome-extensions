import axios from "axios";

//公共接口 https://qqlykm.cn/
const service = axios.create({
	baseURL: `https://api.disputesicu.com/`,
	timeout: 50000
});

service.defaults.crossDomain = true
//Access-Control-Allow-Origin 指向前端 ip:port
service.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

service.defaults.headers.common["Content-Type"] =
	"application/json;charset=UTF-8";

// request interceptor
service.interceptors.request.use(
	(config) => {
		config.headers["Authorization"] = "token";
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// response interceptor
service.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default service;