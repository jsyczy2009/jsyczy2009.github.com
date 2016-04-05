/**
 * Created by 周游 on 2016/4/5.
 */

(function() {
    var interval = null;
    function $ (id) {
        return document.getElementById(id);
    }
    function addEvent(element,event,listener) {
        try {
            element.addEventListener(event,listener,false);
        }catch(e) {
            try {
                element.attachEvent("on"+event,listener);
            }catch(e) {
                element["on"+event] = listener;
            }
        }
    }
    function getPre(root,queue) {
        if(root) {
            queue.push(root);
            getPre(root.firstElementChild, queue);
            getPre(root.lastElementChild, queue);
        }
    }
    function getMiddle(root,queue) {
        if(root) {
            getMiddle(root.firstElementChild, queue);
            queue.push(root);
            getMiddle(root.lastElementChild, queue);
        }
    }
    function getNext(root,queue) {
        if(root) {
            getNext(root.firstElementChild, queue);
            getNext(root.lastElementChild, queue);
            queue.push(root);
        }
    }
    function reset(queue) {
        clearInterval(interval);
        var divs = document.getElementsByTagName("div");
        for(var i = 0; i < divs.length; i++) {
            divs[i].style.backgroundColor ="#fff";
        }
        queue.length = 0;
    }

    function showDiv(queue) {
        var i = 0;
        queue[i++].style.backgroundColor ="#00f";
        interval = setInterval( function() {
            if(i<queue.length) {
                queue[i-1].style.backgroundColor="#fff";
                queue[i++].style.backgroundColor ="#00f";
            } else {
                clearInterval(interval);
               queue[i-1].style.backgroundColor ="#fff";
            }
        }, $("speed").value);
    }
    function init() {
        var queue = [];
        var root = $('A');
        addEvent($("pre"),"click",function() {
            reset(queue);
            getPre(root,queue);
            showDiv(queue);
        });
        addEvent($("middle"),"click",function() {
            reset(queue);
            getMiddle(root,queue);
            showDiv(queue);
        });
        addEvent($("next"),"click",function() {
            reset(queue);
            getNext(root,queue);
            showDiv(queue);
        });
    }
    init();
})();