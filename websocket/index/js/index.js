// console.log($('.btn'))

// axios的get请求  通过操作DOM节点
// $('.btn').click(function () {
//    console.log($('.sendmsg').val())
//    axios({
//       method: "get",
//       url: '/user',
//       data: {
//          firstName: "Fred",
//          lastName: "Flintstone"
//       }
//    }).then((res) => {
//       console.log(res.data)
//    })
// })
var bool = false;
var ws;
function connect() {
   ws = new WebSocket('ws://localhost:3001');
   ws.onopen = function () {
      bool = true;
      console.log('简历成功')
   }
}
connect();
// sub.onclick = function () {
//    ws.send(name.value + ":" + msg.value);
// }
// 输入昵称
function confirm() {
   // console.log('$(".headinfo").val()')
   // console.log($(".headinfo").val())
   // console.log(img.src)
   if ($('.nameinfo').val() !== '' && bool && img.src) {
      localStorage.setItem('NickName', $('.nameinfo').val());
      localStorage.setItem('Head', img.src);
      $('.chat').css('display', 'block')
      $('.info').css('display', 'none')
      $('.msglist').append("<li class='connect'>连接成功建立</li>")
   } else {
      $('.nameinfo').attr('placeholder', '请输入昵称')
      $('.nameinfo').css('input::-webkit-input-placeholder', 'red')
   }
}
function judgelocal() {
   if (localStorage.getItem('NickName')) {
      $('.msglist').append("<li class='connect'>连接成功建立</li>")
      $(".chat").css('display', 'block')
      $(".info").css('display', 'none')
   } else {

      $(".chat").css('display', 'none')
      $(".info").css('display', 'block')
      $(".nameinfo").val('');
      $(".imgcontainer img").remove()
      $(".msglist li").remove()
   }
}
const img = new Image();
judgelocal();

// 上传头像
function uploadhead() {
   var reader = new FileReader();
   // console.log($(".headinfo")[0].files[0])
   var simpleFile = $(".headinfo")[0].files[0];
   if (simpleFile) {
      if (!/image\/\w+/.test(simpleFile.type)) {
         alert("请确保文件类型为图像类型");
         return false;
      }
      // 将文件以Data URL形式进行读入页面
      reader.readAsDataURL(simpleFile);
      reader.onload = function (e) {
         img.src = this.result
         $('.imgcontainer').append(img);
         $('.imgcontainer img').css({ 'width': '100%', 'height': '100%' })
      }

   }
   // $("#files")[0].files[0]
}


// 回车键确认昵称和头像
$('.nameinfo').bind('keypress', function (e) {
   if (e.keyCode == '13') {
      confirm()
   }
})




// 发送消息
function sendmessage() {
   if ($('.sendmsg').val() !== '') {
      var arr = [localStorage.getItem('NickName'), $('.sendmsg').val(), localStorage.getItem('Head')];
      var obj = {
         NickName: localStorage.getItem('NickName'),
         msg: $('.sendmsg').val(),
         Head: localStorage.getItem('Head')
      }
      ws.send(JSON.stringify(obj));
      $('.sendmsg').val('')
   }

}
// 回车键发送消息
$('.sendmsg').bind('keypress', function (e) {
   if (e.keyCode == '13') {
      sendmessage()
   }
})

// 通讯
ws.onmessage = function (e) {
   console.log("e.data++++")
   console.log(JSON.parse(e.data))
   var result = JSON.parse(e.data);
   if (result.NickName == localStorage.getItem('NickName')) {
      $('.msglist').append("<li class='msg cl'><img class='fr' src=" + "'" + result.Head + "'" + "/><span class='fr spann cl' style='margin-right:10px'><span class='nickname'>" + result.NickName + '：' + "</span><span class='textcontent fr'>" + result.msg + '</span>' + "</span></li>");
   } else {
      $('.msglist').append("<li class='msg cl'><img class='fl' src=" + "'" + result.Head + "'" + "/><span class='fl spann cl' style='margin-left:10px'><span class='nickname textleft'>" + result.NickName + '：' + "</span><span class='textcontent fl'>" + result.msg + '</span>' + "</span></li>");
   }
   var allliheight = 0;
   for (var i = 0; i < $(".msg").length; i++) {
      allliheight += $('.msg').eq(i).outerHeight();
   }
   var ulheight = $(".msglist").outerHeight();
   console.log("allliheight")
   console.log(allliheight, ulheight)
   if (ulheight - allliheight <= 10) {
      console.log('我执行')
      $(".msglist").scrollTop(allliheight)
   }
}

function exitchat() {
   console.log('点击退出')
   localStorage.clear();
   judgelocal();
}