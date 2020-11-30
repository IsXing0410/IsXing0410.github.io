var showPage = (function () {
    var pageIndex = 1, // 当前显示的页面索引
        pages = $$(".page_container .page"), //拿到所有的页面元素
        nextIndex = null;   // 当前显示页面的相邻页面索引

    /*
     * 设置静止状态下的各种样式
     */

    function setStatic() {
        nextIndex = null; // 静止状态下没有下一个页面
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (i == pageIndex) {
                // 这个页面就是目前显示的页面
                page.style.zIndex = 1;
            } else {
                page.style.zIndex = 10;
            }
            // 位置
            page.style.top = (i - pageIndex) * height() + 'px';
        }
    }
    setStatic();

    function moving(dis) {
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (i !== pageIndex) {
                // 位置
                page.style.top = (i - pageIndex) * height() + dis + 'px';
            }
        }

        if (dis > 0 && pageIndex > 0) { // 往下在移动，同时，目前不是第一页
            nextIndex = pageIndex - 1;
        } else if (dis < 0 && pageIndex < pages.length - 1) { // 往上在移动，同时，目前不是最后一页
            nextIndex = pageIndex + 1;
        } else {
            nextIndex = null;
        }

    }


    function finishMove() {
        if (nextIndex == null) {
            setStatic(); // 复位
            return;
        }

        var nextPage = pages[nextIndex];
        nextPage.style.transition = '0.5s';
        nextPage.style.top = 0 + "px";

        setTimeout(function () {
            // 当前页面变了，更改pageIndex
            pageIndex = nextIndex;
            // 动画完成后
            nextPage.style.transition = ''; // 动画完了要把它去掉。why？
            setStatic();
        }, 500)
    }



    // 事件
    var pageContainer = $(".page_container");
    pageContainer.ontouchstart = function (e) {
        var y = e.touches[0].clientY;
        function handler(e) {
            var dis = e.touches[0].clientY - y;
            if (Math.abs(dis) < 20) {
              // 防止误触
              dis = 0; // 相当于手指没动
            }
            moving(dis);
            // 阻止事件的默认行为
            if (e.cancelable) {
              // 如果事件可以取消
              e.preventDefault(); // 取消事件 - 阻止默认行为
            }
          } 
        //手指按下，监听移动
        pageContainer.addEventListener("touchmove",handler,{
            passive:false
        }) ; 

        pageContainer.ontouchend = function () {
            finishMove();
            pageContainer.removeEventListener("touchmove", handler);
        }
    }

    // 自动切换到某个板块
    // index：页面索引
    function showPage(index) {
        // 处理切换时的动画效果
        var nextPage = pages[index]; // 下一个页面元素
        if (index < pageIndex) {
            // 下一个页面在当前页面上面
            nextPage.style.top = -height() + "px";
        } else if (index > pageIndex) {
            // 下一个页面在当前页面下面
            nextPage.style.top = height() + "px";
        } else {
            // 下一个页面就是当前页面
            if (pageIndex === 0) {
                pageIndex++;
                setStatic(); // 重新设置位置
            } else {
                pageIndex--;
                setStatic();
            }
        }
        // 强行让浏览器渲染
        nextPage.clientHeight; // 读取
        nextIndex = index;
        finishMove();
    }

    return showPage;
})();