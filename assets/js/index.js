$(function () {
  //获取基本信息
  getUserInfo()
  var layer = layui.layer
  // 点击按钮，实现退出功能
  $('#btnLogout').on('click', function () {
    // console.log('ok');提示用户是否退出
    layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // console.log('ok');
      // 清空本地存储的token
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = '/login.html'
      layer.close(index);
    });
  })
})
//获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      //调用渲染用户 头像
      renderAvatar(res.data)
    },
    // 不论成功还是失败，最终调用complete
    // complete: function (res) {
    //   console.log('执行了complete');
    //   console.log(res);
    //   //可以使用res.responseJSON拿到数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     //1.强制清空token
    //     localStorage.removeItem('token')
    //     //2.强制跳转到登录页面
    //     location.href = '/login.html'
    //   }
    // }
  })
}
//这是渲染用户头像
function renderAvatar(user) {
  //获取用户名称
  var name = user.nickname || user.username
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  //3.
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src'.user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}