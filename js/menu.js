(function(){
    // 切换菜单的显示状态
    var divSwitch = $(".menu_switch"),
    ulNav = $(".menu_nav");

    function toggleNav(){
    // divSwitch 有类样式 则去掉 没有就加
    divSwitch.classList.toggle("menu_switch_expand");
    ulNav.classList.toggle("menu_nav_visible");
    }
    
    divSwitch.onclick = toggleNav;

    ulNav.addEventListener("click",function(){
        toggleNav();
    })
})();