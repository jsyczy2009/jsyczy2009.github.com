/**
 * Created by 周游 on 2016/3/23.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city = document.getElementById("aqi-city-input").value;
    var air = document.getElementById("aqi-value-input").value;
    city = trim(city);
    air = trim(air);
    var creg =/^[\u4e00-\u9fa5a-zA-Z]+$/g;
    if(!creg.test(city)){
        alert("请输入正确的城市名");
        return;
    }
    var areg =/^\d+$/g;
    if(!areg.test(air)) {
        alert("请输入正确的空气质量指数");
        return;
    }
    aqiData[city] = air;
}
/**
 *去空字符函数
 */
function trim(str) {
    var newStr = str.replace(/^\s*$/,"");
    return newStr;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var items =[];
    //aqiData不为空
    if(!isNullObject(aqiData)) {
        items.push("<tr>");
        items.push("<th>城市</th>");
        items.push("<th>空气质量</th>");
        items.push("<th>操作</th>");
        items.push("</tr>");
        for(var va in aqiData) {
            items.push("<tr>");
            items.push("<td>"+va+"</td>");
            items.push("<td>"+aqiData[va]+"</td>");
            items.push("<td><input type='button' value='删除' onclick='delBtnHandle(\"" + va + "\")'></td>");
            items.push("</tr>");
        }
    }
    var inStr = items.join("");
    var table = document.getElementById("aqi-table");
    table.innerHTML=inStr;
}
/**
 * 判断对象是否为空
 */
function isNullObject(obj) {
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}
/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(val) {
    // do sth.
    delete aqiData[val];
    renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    var but =document.getElementById("add-btn");
    but.addEventListener("click",addBtnHandle,false);
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}

window.onload = init;
