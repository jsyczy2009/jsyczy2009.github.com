/**
 * Created by 周游 on 2016/4/6.
 */
(function() {
    var intervel;
    function $ (id) {
        return document.getElementById(id);
    }
    //前序深度遍历
    function depTravelPre(root,stack,result) {
        if(root) {
            result.push(root);
            var children = root.children;
            for(var i = 0; i< children.length; i++) {
                if(children[i].nodeName != "SPAN") {
                    depTravelPre(children[i], stack, result);
                }
            }
        }
    }
    // 搜索
    function search(root,process,result,key) {
        if(root) {
            process.push(root);
            var children = root.children;
            for(var i = 0; i< children.length; i++) {
                if(children[i].nodeName == "SPAN") {
                    if(children[i].innerText == key) {
                        var par =children[i].parentNode;
                        result.push(par);
                    }
                }
                if(children[i].nodeName != "SPAN") {
                    search(children[i],process,result,key);
                }
            }
        }
    }
    //后序深度遍历
    function depTravelNext(root,stack,result) {
        if(root) {
            var children = root.children;
            for(var i = 0; i< children.length; i++) {
                if(children[i].nodeName != "SPAN") {
                    depTravelNext(children[i], stack, result);
                }
            }
            result.push(root);
        }
    }
    //中序深度
    function depTravelMiddle(root,stack,result) {
        if(root) {
            var first = root.firstElementChild;
            if(first) {
                if (first.nodeName == "SPAN") {
                    first = first.nextElementSibling;
                }
                depTravelMiddle(first, stack, result);
            }
            result.push(root);
            var children = root.children;
            for(var i = 0; i< children.length; i++) {
                if(children[i].nodeName != "SPAN") {
                    depTravelMiddle(children[i+1], stack, result);
                }
            }
        }
    }
    //倒序广度
    function rangeTravelNext(root,stack,result) {
        if(root != null) {
            stack.push(root);
            while(stack.length != 0 ) {
                var temp =stack.pop();
                result.push(temp);
                var children = temp.children;
                for(var i = 0 ; i< children.length; i++) {
                    if(children[i].nodeName != "SPAN") {
                        stack.push(children[i]);
                    }
                }
            }
        }
    }
    //广度搜索
    function rangeTravel(root,queue,result) {
        if(root) {
            queue.push(root);
            while(queue.length != 0) {
                var temp = queue.shift();
                result.push(temp);
                var children = temp.children;
                for(var i = 0; i< children.length; i++) {
                    if(children[i].nodeName != "SPAN") {
                        queue.push(children[i]);
                    }
                }
            }
        }
    }
    //重置
    function reset(arr,result) {
        clearInterval(intervel);
        var allDivs = document.getElementsByTagName("div");
        for(var i = 0; i< allDivs.length; i++) {
            allDivs[i].style.backgroundColor= "#fff";
        }
        arr.length =0;
        result.length =0;
    }
    //节点展示
    function showDiv(arr,result) {
        if(!result) {
            var i = 0;
            arr[i++].style.backgroundColor ="#00f";
            intervel = setInterval( function() {
                    if(i < arr.length) {
                        arr[i-1].style.backgroundColor="#fff";
                        arr[i++].style.backgroundColor ="#00f";
                    } else {
                        arr[i-1].style.backgroundColor="#fff";
                        clearInterval(intervel);
                    }
                },500)
        } else {
            if(result.length == 0) {
                alert("没有找到相应的节点");
                return;
            }
            var i = 0;
            arr[i++].style.backgroundColor ="#00f";
            intervel = setInterval( function() {
                if(i < arr.length) {
                    if(result.indexOf(arr[i-1]) == -1) {
                        arr[i - 1].style.backgroundColor = "#fff";
                    } else {
                        arr[i - 1].style.backgroundColor = "#f00";
                    }
                        arr[i++].style.backgroundColor = "#00f";

                } else {
                    if(result.indexOf(arr[i-1]) == -1) {
                        arr[i-1].style.backgroundColor="#fff";
                    } else {
                        arr[i - 1].style.backgroundColor = "#f00";
                    }
                    clearInterval(intervel);
                }
            },500)
        }
    }
    function init() {
        var root = $("root");
        var arr = [];
        var result = [];
        $("preDep").addEventListener("click",function() {
            reset(arr,result);
            depTravelPre(root,arr,result);
            showDiv(result);
        },false);
        $("middleDep").addEventListener("click",function() {
            reset(arr,result);
            depTravelMiddle(root,arr,result);
            showDiv(result);
        },false);
        $("nextDep").addEventListener("click",function() {
            reset(arr,result);
            depTravelNext(root,arr,result);
            showDiv(result);
        },false);
        $("range").addEventListener("click",function() {
            reset(arr,result);
            rangeTravel(root,arr,result);
            showDiv(result);
        },false);
        $("search").addEventListener("click",function() {
            var key = $("key").value;
            reset(arr,result);
            search(root,arr,result,key);
            showDiv(arr,result);
        })

    }
    init();

})()