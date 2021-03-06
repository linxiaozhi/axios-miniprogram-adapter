const app = getApp()
import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
axios.defaults.adapter = mpAdapter
Page({
  data: {

  },
  // 基本请求调用
  handleBase () {
    // 创建实例 设置baseURL
    const instance = axios.create({
      baseURL: 'https://easy-mock.com'
    })
    // 设置token
    instance.defaults.headers.common['Authorization'] = 'I am a token';
    instance.get('/mock/5be12b95f7aed41684f2daea/axiosTest/getPersonByGet')
    .then(resp => {
      console.log('GET请求成功:', resp)
    })

    instance.post('/mock/5be12b95f7aed41684f2daea/axiosTest/getPersonByPost')
    .then(resp => {
      console.log('Post请求成功:', resp)
    })

    instance.request({
      url: 'https://easy-mock.com/mock/5be12b95f7aed41684f2daea/axiosTest/getPersonByGet',
      params: {
        name: '帅锅get Params',
        age: '18'
      }
    })
    .then(resp => {
      console.log('axios.request GET请求带参数成功:', resp)
    })

     instance.request({
      url: 'https://easy-mock.com/mock/5be12b95f7aed41684f2daea/axiosTest/getPersonByPost',
      method: 'POST',
      data: {
        name: '帅锅post Data',
        age: '18'
      }
    })
    .then(resp => {
      console.log('axios.request POST请求带参数成功:', resp)
    })


  },
  // 多个接口迸发调用后统一处理数据
  all () {
    axios.all([
      axios.get('https://api.github.com/users/mzabriskie'),
      axios.get('https://api.github.com/users/mzabriskie/orgs')
    ]).then(axios.spread(function (user, orgs) {
      console.log('接口1数据:', user.data.avatar_url, user.data.name)
      console.log('接口2数据:', orgs.data)
    }));
  },
  // 错误捕获
  catchError () {
    axios.post('https://easy-mock.com/mock/5be12b95f7aed41684f2daea/axiosTest/getPersonByPost22')
    .then(resp => {
      console.log('Post请求成功:', resp)
    }).catch(({message, name, config, code, stack, request , response}) => {
      console.log(`捕获到了异常：${message}\n ${name} \n ${config} \n ${code}\n`,request , response)
    })
  },
  // 数据拦截替换
  transformResponseData () {
    var ISO_8601 = /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})Z/;
    function formatDate(d) {
      return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }

    axios.get('https://api.github.com/users/mzabriskie', {
        transformResponse: axios.defaults.transformResponse.concat(function (data, headers) {
          Object.keys(data).forEach(function (k) {
            if (ISO_8601.test(data[k])) {
              console.log(`字段${k}转换前：`, data[k])
              data[k] = new Date(Date.parse(data[k]));
              console.log(`字段${k}转换后：`, data[k])
            }
          });
          return data;
        })
      })
      .then(function (res) {
        console.log('useravatar', res.data.avatar_url)
        console.log('username', res.data.name)
        console.log('created', formatDate(res.data.created_at))
        console.log('updated', formatDate(res.data.updated_at))
      })
  },
  // 拦截器测试
  interceptors () {
    const instance = axios.create({
      baseURL: 'https://easy-mock.com'
    })
    // 请求拦截器
    instance.interceptors.request.use(function (config) {
      // 发送请求之前你可以在这里对config做一些羞羞的事情
      console.log('请求被拦截到了，加点料', config)
      config.headers['Authorization'] = '123ba'
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // 添加一个响应拦截器
    instance.interceptors.response.use(function (response) {
      console.log('拦截到响应数据了，我过滤下,过滤前的数据：', response)
      // Do something with response data
      return response.data;
    }, function (error) {
      // Do something with response error
      return Promise.reject(error);
    });

    instance.get('/mock/5be12b95f7aed41684f2daea/axiosTest/getPersonByGet')
    .then(resp => {
      console.log('经过拦截器后收到的数据:', resp)
    })
  },
  // 请求取消
  requestCancel () {
    var CancelToken = axios.CancelToken;
    var cancel

    axios.get('https://easy-mock.com/mock/5be12b95f7aed41684f2daea/axiosTest/getPersonByGet', {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c
      })
    }).catch(error => {
       if (axios.isCancel(error)) {
         console.log('自己取消了请求', error)
       }
    })

    // cancel the request
    cancel('取消请求')
  },

  handleJump () {
    wx.navigateTo({
      url: '../search-tip/index'
    })
  }
})
