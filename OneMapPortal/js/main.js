/**
 * Created by 周游2009 on 2016/5/31.
 */
$().ready(function () {
        var fontColor = "#666";
        var fontHoverColor = "#EB593F";
        //资源有关js
        function resAnnimation() {
            var colors = ["#e8b875", "#baa1e2", "#6581c3", "#68bcff", "#f97b39", "#97cb26"]
            var rs = $("#resources");
            var ies = rs.find(".container li");
            var hidediv = $(rs.find(".rs_content")[0]);
            ies.each(function (i) {
                var that = $(this);
                that.timer = null;
                that.index = i;
                var oi = that.find("i");
                var h4 = that.find("h4");
                //初始化
                h4.css("color", fontColor);
                var left = parseInt(oi.css("background-position").split("px")[0]);
                var top = parseInt(oi.css("background-position").split("px")[1]);
                if (top < 15) {
                    oi.css("background-position", left + "px " + (top + 10) + "px");
                }
                that.mouseover(function () {
                    h4.css("color", fontHoverColor);
                    clearInterval(that.timer);
                    that.timer = setInterval(function () {
                        var left = parseInt(oi.css("background-position").split("px")[0]);
                        var top = parseInt(oi.css("background-position").split("px")[1]);
                        if (top > 10) {
                            oi.css("background-position", left + "px " + (top - 10) + "px");
                        } else {
                            clearInterval(that.timer);
                        }
                    }, 50);
                });
                that.mouseout(function () {
                    if (hidediv.is(":visible") && $(".level1").html() == h4.html()) {
                        h4.css("color", fontHoverColor);
                    } else {
                        h4.css("color", fontColor);
                    }
                    clearInterval(that.timer);
                    that.timer = setInterval(function () {
                        var left = parseInt(oi.css("background-position").split("px")[0]);
                        var top = parseInt(oi.css("background-position").split("px")[1]);
                        if (top < 15) {
                            oi.css("background-position", left + "px " + (top + 10) + "px");
                        } else {
                            clearInterval(that.timer);
                        }
                    }, 50);
                });
                that.click(function () {
                    var sbs = that.siblings('li');
                    sbs.each(function () {
                        $(this).find("h4").css("color", fontColor);
                    });
                    var curTop = $(document).scrollTop();
                    if (curTop != 530) {
                        $('html,body').animate({scrollTop: 530}, 800);
                    }
                    var level1 = h4.html();
                    $(".level1").html(level1);
                    var id = that.index;
                    //ͨ通过id获取分类数据
                    switch (id) {
                        case '0':
                            break;
                    }
                });
            });
            rs.click(function (e) {
                var e = window.event || e;
                var obj = $(e.srcElement || e.target);
                if ($(obj).is("li,a,i,h4,.rs_content,dl,dd,span,p")) {
                    hidediv.slideDown(500);
                } else {
                    ies.each(function () {
                        $(this).find("h4").css("color", fontColor);
                    });
                    hidediv.slideUp(500);
                }
            });
            var dds = hidediv.find("dd");
            dds.each(function (index) {
                var that = $(this);
                that.index = index;
                var second = $(that.find("li")[0]);
                second.css({"background-color": colors[that.index % 6]});
            });
        }

        //地理信息
        function pacleInfoAbout() {
            var place = $("#placeinfo");
            var pops = place.find(".col-md-4");
            pops.each(function () {
                var that = $(this);
                var mask = that.find(".mask");
                var img = that.find("img");
                that.mouseover(function () {
                    mask.show();
                });
                that.mouseout(function () {
                    mask.hide();
                });
            });
        }

        //基础数据
        function basedataAbout() {
            var sdcolor = "#EB6F62";
            var base = $("#basedatas");
            var lis = base.find("li");
            lis.each(function () {
                var that = $(this);
                var $i = $(that.find("i")[0]);
                var $h3 = $(that.find("h3")[0]);
                that.mouseover(function () {
                    $h3.css({"color": sdcolor});
                    $i.css({"box-shadow": "-10px 0px 10px " + sdcolor + ",0px -10px 10px " + sdcolor + ", 10px 0px 10px " + sdcolor + ", 0px 10px 10px " + sdcolor});
                });
                that.mouseout(function () {
                    $h3.css({"color": fontColor});
                    $i.css("box-shadow", "none");
                });
            });
        }

        //滑动
        function moveDown() {
            $("#sy").click(function (e) {
                $('body,html').animate({scrollTop: 0}, 800);
            });
            $("#zyml").click(function (e) {
                var offset = $("#resources").offset().top - 60;
                $('body,html').animate({scrollTop: offset}, 800);
            });
            $("#jcsj").click(function (e) {
                var offset = $("#basedatas").offset().top - 60;
                $('body,html').animate({scrollTop: offset}, 800);
            });
            $("#rhfw").click(function (e) {
                var offset = $("#mixservice").offset().top - 60;
                $('body,html').animate({scrollTop: offset}, 800);
            });
            $("#dlxx").click(function (e) {
                var offset = $("#placeinfo").offset().top - 60;
                $('body,html').animate({scrollTop: offset}, 800);
            });
            $("#lxwm").click(function (e) {
                var offset = $("#news").offset().top - 60;
                $('body,html').animate({scrollTop: offset}, 800);
            });
        }

        function init() {
            var $search = $("#search");
            var btns = $search.find(".search-btn");
            $(btns[0]).mouseover(function () {
                $(this).css({
                    "background-image": "url(" + "../images/search_btn.png" + ")",
                    "background-position": "40px -210px"
                });
            });
            var loginMask = $($(".loginMask")[0]);
            var totalHeight = $(document).height();
            loginMask.css("height", totalHeight + "px");

            $(document).scroll(function () {
                var sctop = $(document).scrollTop();
                var bars = $("#nav-bar");
                var aes = $(bars).find("a");
                aes.each(function () {
                    $(this).removeClass("a-active");
                    $(this).addClass("a-notactive");
                });
                //页面位置
                var searchHeight = parseInt($("#search").height());
                var resouseTop = parseInt($("#resources").offset().top) - searchHeight;
                var basedataTop = parseInt($("#basedatas").offset().top) - searchHeight;
                var mixTop = parseInt($("#mixservice").offset().top) - searchHeight;
                var placeTop = parseInt($("#placeinfo").offset().top) - searchHeight;
                var newsTop = parseInt($("#news").offset().top) - searchHeight
                console.log(sctop)
                if (sctop < resouseTop) {
                    $("#sy").removeClass("a-notactive").addClass("a-active");
                } else if (sctop < basedataTop) {
                    $("#zyml").removeClass("a-notactive").addClass("a-active");
                } else if (sctop < mixTop) {
                    $("#jcsj").removeClass("a-notactive").addClass("a-active");
                } else if (sctop < placeTop) {
                    $("#rhfw").removeClass("a-notactive").addClass("a-active");
                } else if (sctop < newsTop) {
                    $("#dlxx").removeClass("a-notactive").addClass("a-active");
                } else {
                    $("#lxwm").removeClass("a-notactive").addClass("a-active");
                }
            });
            pacleInfoAbout();
            resAnnimation();
            basedataAbout();
            moveDown();
        }
        init();
    }
);

