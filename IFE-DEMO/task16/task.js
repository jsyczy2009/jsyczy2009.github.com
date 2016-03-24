/**
 * Created by ���� on 2016/3/23.
 */
/**
 * aqiData���洢�û�����Ŀ���ָ������
 * ʾ����ʽ��
 * aqiData = {
 *    "����": 90,
 *    "�Ϻ�": 40
 * };
 */
var aqiData = {};

/**
 * ���û������л�ȡ���ݣ���aqiData������һ������
 * Ȼ����Ⱦaqi-list�б���������������
 */
function addAqiData() {
    var city = document.getElementById("aqi-city-input").value;
    var air = document.getElementById("aqi-value-input").value;
    city = trim(city);
    air = trim(air);
    var creg =/^[\u4e00-\u9fa5a-zA-Z]+$/g;
    if(!creg.test(city)){
        alert("��������ȷ�ĳ�����");
        return;
    }
    var areg =/^\d+$/g;
    if(!areg.test(air)) {
        alert("��������ȷ�Ŀ�������ָ��");
        return;
    }
    aqiData[city] = air;
}
/**
 *ȥ���ַ�����
 */
function trim(str) {
    var newStr = str.replace(/^\s*$/,"");
    return newStr;
}

/**
 * ��Ⱦaqi-table���
 */
function renderAqiList() {
    var items =[];
    //aqiData��Ϊ��
    if(!isNullObject(aqiData)) {
        items.push("<tr>");
        items.push("<th>����</th>");
        items.push("<th>��������</th>");
        items.push("<th>����</th>");
        items.push("</tr>");
        for(var va in aqiData) {
            items.push("<tr>");
            items.push("<td>"+va+"</td>");
            items.push("<td>"+aqiData[va]+"</td>");
            items.push("<td><input type='button' value='ɾ��' onclick='delBtnHandle(\"" + va + "\")'></td>");
            items.push("</tr>");
        }
    }
    var inStr = items.join("");
    var table = document.getElementById("aqi-table");
    table.innerHTML=inStr;
}
/**
 * �ж϶����Ƿ�Ϊ��
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
 * ���add-btnʱ�Ĵ����߼�
 * ��ȡ�û����룬�������ݣ�������ҳ����ֵĸ���
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * �������ɾ����ť��ʱ��Ĵ����߼�
 * ��ȡ�ĸ��������ݱ�ɾ��ɾ�����ݣ����±����ʾ
 */
function delBtnHandle(val) {
    // do sth.
    delete aqiData[val];
    renderAqiList();
}

function init() {

    // ���������add-btn��һ������¼������ʱ����addBtnHandle����
    var but =document.getElementById("add-btn");
    but.addEventListener("click",addBtnHandle,false);
    // ��취��aqi-table�е�����ɾ����ť���¼�������delBtnHandle����

}

window.onload = init;
