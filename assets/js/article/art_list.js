$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  //定义美化时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义补0函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  //定义一个查询参数对象，将来请求数据的时候，提交到服务器
  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  initTable()
  initCate()
  // 获取文章列表数据方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面数据
        // layer.msg('获取文章列表成功！')
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        //调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('这是获取分类数据失败')
        }
        //调用模板引擎渲染分类的可靠项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }
  //为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询参数对象q中对应的属性值
    q.cate_id = cate_id
    q.state = state
    //根据最新的筛选条件重新渲染表格数据
    initTable()
  })
  // 定义渲染分页的方法
  function renderPage(total) {
    //调用laypage.render(方法来渲染分页结构
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发jump回调用
      jump: function (obj, first) {
        // console.log(obj.curr);
        // 把最新的页码值，赋值到
        q.pagenum = obj.curr
        // 把最新的条目数赋值到q查询参数对象的pagesize属性中
        q.pagesize = obj.limit
        // 根据最新的q获取对应数据列表，并渲染表格
        if (!first) {
          initTable()
        }
      }
    })
  }
  // 通过代理，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    // console.log('ok');
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    // 获取到文章的id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要
          if (len === 1) {
            //len值等于1没数据了
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    });
  })
})