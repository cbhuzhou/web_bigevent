$(function () {
  //点击去注册账号链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  //点击去登录的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  //从layui中获取form对象
  var form = layui.form
  var layer = layui.layer
  //form.verify自定义规则
  form.verify({
    //自定义了pwd检验规则
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '二次密码不一致'
      }
    }
  })
  //监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data,
      function (res) {
        if (res.status !== 0) {
          // return console.log(res.message);
          return layer.msg(res.message)
        }
        // console.log('注册成功');
        layer.msg('注册成功，请登录')
        //模拟人的点击行为
        $('#link_login').click()
      })
  })
  //监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      //快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败')
        }
        layer.msg('登录成功')
        // console.log(res.token);
        //token
        localStorage.setItem('token', res.token)
        //跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})