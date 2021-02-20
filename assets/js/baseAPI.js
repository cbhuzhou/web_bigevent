//每次调用$.get(),$.post(),$.ajax()时候，先调用这函数
$.ajaxPrefilter(function (options) {
  // console.log(options.url);
  //在发起真正的AJAX请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url
  console.log(options.url);
})