//每次调用$.get(),$.post(),$.ajax()时候，先调用这函数
$.ajaxPrefilter(function (options) {
  // console.log(options.url);
  //在发起真正的AJAX请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url
  // console.log(options.url);
  //统一为有权限的接口，设置heads请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  //全局统一挂载complete回调函数
  options.complete = function (res) {
    // console.log('执行了complete');
    // console.log(res);
    //可以使用res.responseJSON拿到数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //1.强制清空token
      localStorage.removeItem('token')
      //2.强制跳转到登录页面
      location.href = '/login.html'
    }
  }
})