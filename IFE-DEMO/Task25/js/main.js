/**
 * Created by 周游 on 2016/4/20.
 */

(function(){
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "")
    }
    var interval;
    function labelHover() {
        var labels = document.getElementsByTagName("label");
        for(var i = 0; i<labels.length;i++) {
            //labels[i].addEventListener("mouseout",function() {
            labels[i].onmouseout=function() {
                var children = this.children;
                for(var j = 0; j<children.length;j++) {
                    if(children[j].getAttribute("class")==="add"||children[j].getAttribute("class")==="delete") {
                        children[j].style.display ="none";
                    }
                }
            }//)
             //labels[i].addEventListener("mouseover",function() {
            labels[i].onmouseover = function() {
                var children = this.children;
                for(var j = 0; j<children.length;j++) {
                    children[j].style.display ="inline-block";
                }
            }//);
        }
    }

    function travel(root,process,result,key) {
        if(root) {
            process.push(root);
            var child = root.children;
                for(var i =0; i<child.length;i++) {
                    if(child[i].nodeName =="DIV") {
                        //console.log(child[i].innerText);
                        var texts =child[i].innerText.trim().split("\n");
                        if(texts[0] == key) {
                            result.push(child[i]);
                        }
                        travel(child[i],process,result,key);
                    }
                }
        }
    }
    function resetDiv(process,result) {
        var divs = document.getElementsByTagName("div");
        for(var i= 0; i<divs.length;i++) {
            divs[i].style.backgroundColor="#fff";
        }
    }
    function showDiv(process,result) {
        if(result.length == 0) {
            alert("没有找到相应的节点");
            return;
        }
        var i = 1;
        process[i].style.display ="block";
        process[i++].style.backgroundColor ="#f9ec65";
        interval = setInterval(function() {
            if(i < process.length) {
                if(result.indexOf(process[i-1]) == -1) {
                    process[i-1].style.backgroundColor="#fff";
                } else {
                    process[i-1].style.backgroundColor="#fe8099";
                }
                    process[i++].style.backgroundColor="#f9ec65";
                    process[i].style.display ="block";
            } else {
                if(result.indexOf(process[i-1]) == -1) {
                    process[i-1].style.backgroundColor="#fff";
                } else {
                    process[i-1].style.backgroundColor="#fe8099";
                }
                clearInterval(interval);
            }
        },500);

    }
    function changeDivDisplay() {
        var spans = document.getElementsByTagName("span");
        for(var i= 0; i<spans.length;i++) {
            if(spans[i].getAttribute("class") ==="icon") {
                //spans[i].addEventListener("click",function(event) {
                spans[i].onclick = function(event) {
                    event.stopPropagation();
                    var parentDiv = this.parentNode.parentNode;
                    var childs = parentDiv.childNodes;
                    for(var j = 0; j<childs.length; j++) {
                        if(childs[j].nodeName == "DIV") {
                            if(childs[j].style.display != "none"){
                                this.className ="icondown";
                                childs[j].style.display = "none";
                            } else {
                                this.className ="icon";
                                childs[j].style.display = "block";
                            }
                        }
                    }
                }
            }
        }
    }
    function searchELement() {
        document.getElementById("search").addEventListener("click",function() {

            var root = document.getElementById("root");
            var key = document.getElementById("key").value;
            var process =[],result=[];
            if(key.trim() != "") {
                resetDiv(process,result);
                travel(root,process,result,key);
                console.log(result);
                showDiv(process,result);
            } else {
                alert("请输入查询关键字");
                return;
            }
        })
    }
    function addChild() {
        var spans = document.getElementsByTagName("span");
        for(var i =0; i<spans.length;i++) {
            if(spans[i].getAttribute("class")==="add") {
                //spans[i].addEventListener("click",function(event) {
                spans[i].onclick = function(event) {
                    event.stopPropagation();
                    var text = prompt("请输入子节点").trim();
                    if(text != "" && text != null) {
                        var parentDiv = (this.parentNode).parentNode;
                        var div = document.createElement("div");
                        div.setAttribute("class","item");
                        var str = "<label><span class='icon'></span> <span class='key-name'>"+text+"</span><span class='add'></span><span class='delete'></span></label>"
                        div.style.backgroundColor="#fff";
                        div.innerHTML = str;
                        parentDiv.appendChild(div);
                    } else {
                        return;
                    }
                    labelHover();
                    addChild();
                    changeDivDisplay();
                }
            }
            if(spans[i].getAttribute("class")==="delete") {
                //spans[i].addEventListener("click",function(event) {
                spans[i].onclick = function(event) {
                    event.stopPropagation();
                    var conf = confirm("确认删除此节点吗？");
                    if(conf) {
                        var parentDiv = (this.parentNode).parentNode.parentNode;
                        parentDiv.removeChild((this.parentNode).parentNode);
                    } else {
                        return;
                    }
                }
            }
        }
    }

    function init() {
        labelHover();
        addChild();
        changeDivDisplay();
        searchELement();
    }
    init();
}) ()