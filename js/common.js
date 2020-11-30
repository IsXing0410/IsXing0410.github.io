
// 感觉这有点骚气，直接就好了啦
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function width() {
  return document.documentElement.clientWidth;
}

function height() {
  return document.documentElement.clientHeight;
}


// 轮播图
// var carouselId = "newsCarousel",  // 容器id
//   datas = [
//     {
//       link:
//         "https://lolm.qq.com/m/news_detail.html?docid=8584324486918752329&amp;e_code=492513&amp;idataid=279688",
//       image:
//         "https://ossweb-img.qq.com/upload/adw/image/20191015/80cbdbaff4a1aa009f61f9240a910933.jpeg",
//     },
//     {
//       link:
//         "https://lolm.qq.com/m/news_detail.html?docid=13355407427466544705&amp;e_code=492506&amp;idataid=279689",
//       image:
//         "https://ossweb-img.qq.com/upload/adw/image/20191015/696545e262f2cbe66a70f17bf49f81e0.jpeg",
//     },
//     {
//       link:
//         "https://lolm.qq.com/m/news_detail.html?docid=15384999930905072890&amp;e_code=492507&amp;idataid=279690",
//       image:
//         "https://ossweb-img.qq.com/upload/adw/image/20191018/3c910d44898d7221344718ef3b7c0a7e.jpeg",
//     },
//   ];    // 轮播图数据


function createCarousel(carouselId, datas) {
  // 获取轮播图的组件：

  var container = document.getElementById(carouselId), // 获取整个轮播图容器
    carouselList = container.querySelector(".g_carousel_list"), // 获取轮播图列表
    indicator = container.querySelector(".g_carousel_indicator"), // 获取指示器
    prev = container.querySelector(".g_carousel_prev"), // 获取左箭头
    next = container.querySelector(".g_carousel_next"); // 获取右箭头

  var curIndex = 0;

  // 创建轮播图中的各种元素

  function createCarouselElements() {
    var listHtml = "",  // 轮播图列表内部的html
      indHtml = "";   // 指示器的内部html 
    for (var i = 0; i < datas.length; i++) {
      var data = datas[i];
      if (data.link) {
        listHtml += `<li>
        <a href="${data.link}">
          <img src="${data.image}" alt="">
        </a>
        </li>`;
      } else {
        listHtml += `<li>
          <img src="${data.image}" alt="">
        </li>`;
      }
      indHtml += "<li></li>"

    }
    carouselList.style.width = `${datas.length}00%`;
    carouselList.innerHTML = listHtml;
    indicator.innerHTML = indHtml;
  }
  createCarouselElements();


  /*
  * 根据目前的索引，设置正确的状态
  */
  function setStatus() {
    carouselList.style.marginLeft = -curIndex * width() + 'px';
    //设置提示器状态
    // 取消之前的selected
    var beforeSelected = indicator.querySelector(".selected");
    if (beforeSelected) {
      beforeSelected.classList.remove("selected");
    }
    indicator.children[curIndex].classList.add("selected");
    // 处理按钮
    if (prev) {
      if (curIndex === 0) {
        // 目前为第一张图时
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled")
      }
    }

    if (next) {
      if (curIndex === datas.length - 1) {
        // 目前为最后一张图
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled")
      }
    }
  }

  setStatus();



  /*
  * 左箭头
  */
  function toPrev() {
    if (curIndex === 0) {
      return; // 没有上一个
    }

    curIndex--;
    setStatus();
  }

  /*
  * 右箭头
  */
  function toNext() {
    if (curIndex === datas.length - 1) {
      return; // 没有下一个
    }

    curIndex++;
    setStatus();
  }


  /*
  * 开始自动切换
  */

  var timer = null;

  function start() {
    if (timer) {
      // 已经在切换了
      return;
    }
    timer = setInterval(function () {
      curIndex++;
      if (curIndex === datas.length) {
        curIndex = 0;
      }
      setStatus();
    }, 2000);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }
  start();

  //事件
  if (prev) {
    prev.onclick = toPrev;
  }

  if (next) {
    next.onclick = toNext;
  }

  // 横向拖到的时候就不要上下滑动了（怕斜滑）
  // 拖动的时候不要有动画了

  container.ontouchstart = function (e) {
    e.stopPropagation(); // 阻止事件冒泡
    var x = e.touches[0].clientX; // 记录下横坐标
    var pressTime = Date.now(); // 手指按下的时间
    carouselList.style.transition = "none";
    stop();
    // 监听移动事件
    container.ontouchmove = function (e) {
      var dis = e.touches[0].clientX - x;
      carouselList.style.marginLeft = -curIndex * width() + dis + "px";
    };
    // 放手
    container.ontouchend = function (e) {
      var dis = e.changedTouches[0].clientX - x;
      start();
      //
      carouselList.style.transition = "";
      //
      container.ontouchmove = null;
      var duration = Date.now() - pressTime; // 滑动的时间
      // 300毫秒内都算快速滑动
      if (duration < 300) {
        if (dis > 20 && curIndex > 0) {
          // 300毫秒内快速的向右滑动了至少20像素
          toPrev();
        } else if (dis < -20 && curIndex < datas.length - 1) {
          // 300毫秒内快速的向左滑动了至少20像素
          toNext();
        } else {
          setStatus();
        }
      } else {
        if (dis < -width() / 2 && curIndex < datas.length - 1) {
          toNext();
        } else if (dis > width() / 2 && curIndex > 0) {
          toPrev();
        } else {
          setStatus();
        }
        setStatus();
      }

    }
  };
}


// 代理请求
async function ajax(url) {
  var reg = /http[s]?:\/\/[^/]+/;
  var matches = url.match(reg);
  if (matches.length === 0) {
    throw new Error("invalid url");
  }
  var target = matches[0];
  var path = url.replace(reg, "");
  return await fetch(`https://proxy.yuanjin.tech${path}`, {
    headers: {
      target,
    },
  }).then((r) => r.json());
}