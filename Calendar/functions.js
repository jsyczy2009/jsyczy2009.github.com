/**
 * Created by 周游 on 2016/4/9.
 */
    var $ = function (id) {
        return document.getElementById(id);
    }
    var addEvent = function (element, event, listener) {
        try {
            element.addEventListener(event, listener, false);
        } catch (e) {
            try {
                element.attachEvent("on" + event, listener);
            } catch (e) {
                element["on" + event] = listener;
            }
        }
    }
    var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var calendar = {
        //1900-2100 农历闰月以及大小月信息
        //1-4:有无闰月，有则是闰月的月份
        //16-5：农历一年中的月份，1为30天，0 为29天
        //20-17：有闰月时，1为大闰月30天，0为小闰月29天
        lunarInfo: [
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
            0x05aa0, 0x076a3, 0x096d0, 0x04bdb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
            0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
            0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
            0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
            0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
            0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520//2090-2100
        ],
        //天干
        tianGan: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        //地支
        diZhi: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],
        //生肖
        zodiac: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
        //节气
        solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种",
            "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],
        //农历月份汉字表示
        lunarMonthMess: ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"],
        //农历日期汉字表示
        lunarMess: ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五",
            "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"],
        //农历节日
        lunarHoliday: ["正月初一 春节", "正月十五 元宵节", "五月初五 端午节", "闰五月初五 端午节", "七月初七 七夕节", "闰七月初七 七夕节",
            "八月十五 中秋节", "闰八月十五 中秋节", "九月初九 重阳节", "闰九月初九 重阳节", "腊月廿三 小年", "腊月三十 除夕"],
        //阳历节日
        solarHolidays: ["0101 元旦", "0214 情人节", "0308 妇女节", "0312 植树节", "0315 消费者权益日", "0401 愚人节", "0501 劳动节", "0504 青年节",
            "0512 护士节", "0601 儿童节", "0701 建党节", "0801 建军节", "0808 父亲节", "0910 教师节", "1001 国庆节", "1225 圣诞节"],
        //阳历每月的天数
        solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

        //是否有闰月,有则返回闰月
        hasRunMonth: function (year) {
            var m = calendar.lunarInfo[year - 1900] & 0xf;
            return m;
        },
        //返回闰月的天数,大月30 ，小月29
        getRunMonthDays: function (year) {
            if (calendar.hasRunMonth(year)) {
                return (calendar.lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
            }
            return 0;
        },
        //返回阳历某月的天数
        getSolarMonthDays: function (year, month) {
            if (month < 1 || month > 12) {
                return -1;
            }
            if (month == 2) {
                return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) ? 29 : 28;
            }
            return calendar.solarMonth[month - 1];
        },
        //返会一年中各个节气的日期
        //以1900年1月0日（星期日）为基准日，之后的每一天与基准日的差值称为“积日”， 1900年1月1日的积日是1
        getLunarYearSolarTermDay: function (year) {
            var termList = [];
            for (var i = 0; i < 24; i++) {
                //计算与1900/01/00的偏移毫秒数
                var sum = (365.242 * (year - 1900) + 6.2 + 15.22 * i - 1.9 * Math.sin(0.262 * i)) * 24 * 3600 * 1000;
                var offDate = new Date(sum + Date.UTC(1900, 0, 0));
                var year = offDate.getUTCFullYear();
                var month = offDate.getUTCMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                var date = offDate.getUTCDate();
                if (date < 10) {
                    date = "0" + date;
                }
                var str = year + "/" + month + "/" + date;
                termList.push(str);
            }
            return termList;
        },
        //以1900年为基准，1900年是庚子
        getYearGanZhi: function (year) {
            var offset = year - 1900;
            var tian = (offset + 7) % 10;
            var di = (offset + 1) % 12;
            if (tian == 0) {
                tian = 9;
            } else {
                tian--;
            }
            if (di == 0) {
                di = 11;
            } else {
                di--;
            }
            return calendar.tianGan[tian] + calendar.diZhi[di];
        },
        //取得年份生肖生肖,1900 鼠年
        getYearZodiac: function (year) {
            var zod = ((year - 1900) + 1) % 12;
            if (zod == 0) {
                zod = 11;
            } else {
                zod--;
            }
            return calendar.zodiac[zod];
        },
    }
    function  getLunarInfoToArray() {
        var infoArrays = {};
        var year = 1900;
        while (year < 2101) {
            var days = [];
            for (var i = 0x8000; i > 0x8; i >>= 1) {
                var d = (calendar.lunarInfo[year - 1900] & i) ? 30 : 29;
                days.push(d);
            }
            var run = calendar.hasRunMonth(year);
            var runDays = calendar.getRunMonthDays(year);
            if (run) {
                days.splice(run, 0, runDays);
            }
            infoArrays[year] = days;
            year++;
        }
        return infoArrays;
    }
    //得到所有农历年份一年的天数 从1900/01/31 年开始
    function getEveryLunarYearDays() {
        var everyYearDays = [];
        var lunars = getLunarInfoToArray();
        for (var i = 1900; i < 2101; i++) {
            var days = arrSum(lunars[i]);
            everyYearDays.push(days);
        }
        return everyYearDays;
    }
    function getEveryYeraLunar() {
        var lunars = getLunarInfoToArray();
        var yearBegins = [];
        var offset = 0;
       // var start = new Date().getTime();
        for (var i = 1901; i < 2101; i++) {
            offset += getEveryLunarYearDays()[i - 1901];
            var nextBase = new Date((Date.UTC(1900, 0, 31) + (offset * 86400000)));//下一年的正月初一
            yearBegins.push(nextBase);
        }
       // var end = new Date().getTime();
        //alert( (end-start)+"ms");
        yearBegins.unshift(new Date("1990/01/31"));
        return yearBegins;
    }
    var yearBeagins = getEveryYeraLunar();//所有年份农历开始开始
        //根据阳历的年月日，返回阳历信息
        function getFullSolarInfo(year, month, date) {
            var solars = [];
            if(year == 1900 && month== 1 && date < 31) {//1900年1月份的数据 手动输入
                switch  (date) {
                    case 1:
                        solars.push(1);
                        solars.push("元旦")
                        break;
                    case 2:
                        solars.push(2);
                        break;
                    case 3:
                        solars.push(3);
                        break;
                    case 4:
                        solars.push(4);
                        break;
                    case 5:
                        solars.push(5);
                        break;
                    case 6:
                        solars.push(6);
                        break;
                    case 7:
                        solars.push(0);
                        break;
                    case 8:
                        solars.push(1);
                        break;
                    case 9:
                        solars.push(2);
                        break;
                    case 10:
                        solars.push(3);
                        break;
                    case 11:
                        solars.push(4);
                        break;
                    case 12:
                        solars.push(5);
                        break;
                    case 13:
                        solars.push(6);
                        break;
                    case 14:
                        solars.push(0);
                        break;
                    case 15:
                        solars.push(1);
                        break;
                    case 16:
                        solars.push(2);
                        break;
                    case 17:
                        solars.push(3);
                        break;
                    case 18:
                        solars.push(4);
                        break;
                    case 19:
                        solars.push(5);
                        break;
                    case 20:
                        solars.push(6);
                        break;
                    case 21:
                        solars.push(0);
                        break;
                    case 22:
                        solars.push(1);
                        break;
                    case 23:
                        solars.push(2);
                        break;
                    case 24:
                        solars.push(3);
                        break;
                    case 25:
                        solars.push(4);
                        break;
                    case 26:
                        solars.push(5);
                        break;
                    case 27:
                        solars.push(6);
                        break;
                    case 28:
                        solars.push(0);
                        break;
                    case 29:
                        solars.push(1);
                        break;
                    case 30:
                        solars.push(2);
                        break;
                    case 31:
                        solars.push(3);
                        break;
                }
                return solars;
            }
            var reg = /^0/g;
            if (!reg.test(month)) {
                if (month < 10) {
                    month = "0" + month;
                }
            }
            if (!reg.test(month)) {
                if (date < 10) {
                    date = "0" + date;
                }
            }
            var str = year + "/" + month + "/" + date;
            var d = new Date(str);
            var day = d.getDay();//星期
            solars.push(day);
            //判断是否是节日
            for (var i = 0; i < calendar.solarHolidays.length; i++) {
                var holiday = calendar.solarHolidays[i].split(" ");
                if (holiday.indexOf((month + date)) != -1) {
                    solars.push(holiday[1]);
                }
            }
            return solars;
        }
        //根据阳历的年月日，返回所有的农历信息 1900/01/31是 鼠年 正月初一 以此为基准计算
        function getAllLunarInfo(year, month, date) {
            //alert(year+"/"+month+"/"+date);

            if(year == 1900 && month== 1 && date < 31) {//1900年1月1日~1900年1月30日 农历猪年 腊月 手动输入
                var res ="";
                switch  (date) {
                    case 1:
                        res = "腊月 初一  ";
                        break;
                    case 2:
                        res = "腊月 初二  ";
                        break;
                    case 3:
                        res = "腊月 初三  ";
                        break;
                    case 4:
                        res = "腊月 初四  ";
                        break;
                    case 5:
                        res = "腊月 初五  ";
                        break;
                    case 6:
                        res = "腊月 初六 小寒 ";
                        break;
                    case 7:
                        res = "腊月 初七  ";
                        break;
                    case 8:
                        res = "腊月 初八  ";
                        break;
                    case 9:
                        res = "腊月 初九  ";
                        break;
                    case 10:
                        res = "腊月 初十  ";
                        break;
                    case 11:
                        res = "腊月 十一  ";
                        break;
                    case 12:
                        res = "腊月 十二  ";
                        break;
                    case 13:
                        res = "腊月 十三  ";
                        break;
                    case 14:
                        res = "腊月 十四  ";
                        break;
                    case 15:
                        res = "腊月 十五  ";
                        break;
                    case 16:
                        res = "腊月 十六  ";
                        break;
                    case 17:
                        res = "腊月 十七  ";
                        break;
                    case 18:
                        res = "腊月 十八  ";
                        break;
                    case 19:
                        res = "腊月 十九  ";
                        break;
                    case 20:
                        res = "腊月 二十 大寒 ";
                        break;
                    case 21:
                        res = "腊月 廿一  ";
                        break;
                    case 22:
                        res = "腊月 廿二  ";
                        break;
                    case 23:
                        res = "腊月 廿三  小年";
                        break;
                    case 24:
                        res = "腊月 廿四  ";
                        break;
                    case 25:
                        res = "腊月 廿五  ";
                        break;
                    case 26:
                        res = "腊月 廿六  ";
                        break;
                    case 27:
                        res = "腊月 廿七  ";
                        break;
                    case 28:
                        res = "腊月 廿八  ";
                        break;
                    case 29:
                        res = "腊月 廿九  ";
                        break;
                    case 30:
                        res = "腊月 三十  除夕";
                        break;
                    case 31:
                        res = "正月 初一  春节";
                        break;
                }
                return res;
            }
            //alert(date);
            var reg = /^0/g;
            if (!reg.test(month)) {
                if (month < 10) {
                    month = "0" + month;
                }
            }
            if (!reg.test(date)) {
                if (date < 10) {
                    date = "0" + date;
                }
            }
            var toDate = year + "/" + month + "/" + date;
            var today = new Date(toDate);
            //alert(toDate);
            var base = new Date("1900/01/31");
            var offset = (today - base) / (86400000);
            var everyYeardays = getEveryLunarYearDays();
        //var start = new Date().getTime();
            var everyYearLunar = yearBeagins;//每个农历的正月初一的日期  耗时
        //var end = new Date().getTime();
       // alert( (end-start)+"ms");
            for (var i = 1900; i < 2101 && offset > 0; i++) {
                offset -= everyYeardays[i - 1900];
            }
            if (offset < 0) {
                offset += everyYeardays[i - 1 - 1900];
                i--;
            }
            var thisYearBase = everyYearLunar[i - 1900];//这一年的农历正月初一 offset是相对于此的偏移量
            // alert(thisYearBase);
            //根据年份和偏移量求日期
            var infos = getLunarInfoToArray();//修改
            var months = infos[i];
            if(calendar.hasRunMonth(year)) {
                if (months.length === 13 && calendar.lunarMonthMess.length == 12) {
                    var run = calendar.hasRunMonth(year);
                    //alert(run);
                    calendar.lunarMonthMess.splice(run, 0, "闰"+(calendar.lunarMonthMess[run - 1]));
                }
            }
            for (var j = 0; j < months.length && offset > 0; j++) {
                offset -= months[j];
            }
            if (offset < 0) {
                offset += months[j - 1];
                j = j - 1;
            }
            var lMonth = calendar.lunarMonthMess[j];//农历月
            var lDate = calendar.lunarMess[offset];//农历日

            var str = lMonth + " " + lDate;//农历
            var check = lMonth + lDate;
            var lHoliday = "";
            //计算农历节日
            //如果腊月小，则没有30天，除夕是腊月二十九，小年是腊月23；
            if (months[months.length - 1] < 30) {
                //alert(months[months.length - 1]);
                if (check == "腊月廿九") {
                    lHoliday += "除夕";
                }
            }
            var hol = calendar.lunarHoliday;
            for (var t = 0; t < hol.length; t++) {
                var item = hol[t].split(" ");
                if (item.indexOf(check) != -1) {
                    lHoliday += item[1];
                }
            }
            //计算农历节气
            var solTerm = ""
            var terms = calendar.getLunarYearSolarTermDay(year);
            //alert(toDate);
            //alert(terms);
            if (terms.indexOf(toDate) != -1) {
                var index = terms.indexOf(toDate);
                //alert(index);
                solTerm = calendar.solarTerm[index];
            }
            str = str + " " + solTerm;
            str = str + " " + lHoliday;
            //alert(str);

            return str;
        }

    //显示当前北京时间
    var interval = self.setInterval(clock, 50);

    function clock() {
        var date = new Date();
        date = date.toLocaleString();
        var dates = date.split(" ");
        var spans = $("bjTime").getElementsByTagName("span");
        spans[1].innerText = dates[0];
        spans[2].innerText = dates[1];
    }

    //获取点击的日期的信息
    function show(day,e) {
        var year = $("year").value;
        var month = $("month").value;
        if(day) {
            var day = day;
        }else {
            var date = new Date();
            var day = date.getDate();
        }
        var solar = getFullSolarInfo(year, month, day);//阳历 数组(星期 节日)
        var lunanr = getAllLunarInfo(year, month, day).split(" "); //农历 字符串(月 日 节气 节日)
        var wek = solar[0];
        var ganZhi = calendar.getYearGanZhi(year);
        var zodiac = calendar.getYearZodiac(year);
        $("selectFullDate").innerHTML = year + "年" + month + "月" + day + "日" + week[wek];
        $("selectDay").innerHTML = day;
        $("selectLunnarDay").innerHTML = lunanr[0]+lunanr[1];
        $("selectLunnarYear").innerHTML = ganZhi +"【"+zodiac+"年"+"】";
    }

    //根据选择年份 月份 显示数据 ，默认显示当前月
    function showDates() {
        //还原lunarMonthMess数组
        calendar.lunarMonthMess = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
        var thisMonth = [];
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var $year = $("year").value;
        var $month = $("month").value;
        if ($year && $month) {
            year = $year;
            month = $month;
        }
        //一年中所有的节气日期
        var solarTerms = calendar.getLunarYearSolarTermDay(year);
        //得到阳历月份的天数
        var days = calendar.getSolarMonthDays(year, month);
        if (month < 10) {
            month = "0" + month;
        }
        for (var d = 1; d <= days; d++) {
            var dayInfo = {}
            var solar = getFullSolarInfo(year, month, d);
        //var start = new Date().getTime();
            var lunanr = getAllLunarInfo(year, month, d);//耗时
        //var end = new Date().getTime();
        //alert( (end-start)+"ms");
            dayInfo.solar = solar;//阳历信息 数组(星期 节日)
            dayInfo.lunanr = lunanr;//农历信息 字符串(月 日 节气 节日)
            if (d < 10) {
                d = "0" + d;
            }
            var ymd = year + "/" + month + "/" + d;
            var index = solarTerms.indexOf(ymd);
            if (index != -1) {
                dayInfo.sTerm = solarTerms[index];//节气信息
            }
            thisMonth.push(dayInfo);

        }
        //"<td onclick='test2(\""+name+"\");'>"+name+"</td>"
        var str = "<tr><th class='table-weekend'>日</th><th>一</th> <th>二</th> <th>三</th><th>四</th> <th>五</th><th class='table-weekend'>六</th></tr><tr>";
        //根据结果渲染 界面
        var i = 0;
        var week = thisMonth[i].solar[0];
        var temp = week;
        for (var j = 0; j < week; j++) {
            str += "<td></td>";
        }

        while (i < thisMonth.length) {
            for (var n = temp; n < 7 && i < thisMonth.length && temp < 7; n++) {
                var day = i + 1;
                //"<tr><td onclick='al("+da+");'>1</td></tr>"
                str += "<td onmouseover='show("+day+",event)' onmouseout='show()'>";
                if (n == 0 || n == 6) {
                    str += "<span class='table-everyday-daynum table-weekend'>" + (i + 1) + "</span><br>";
                } else {
                    str += "<span class='table-everyday-daynum'>" + (i + 1) + "</span><br>";
                }
                var lunanrs = thisMonth[i].lunanr.split(" ");
                //alert(lunanrs);
                var solars = thisMonth[i].solar;
                if (solars[1]) {//阳历节日
                    str += "<span class='table-everyday-festival'>" + solars[1] + "</span>";
                } else {
                    if (lunanrs[3] != "") {//节日
                        str += "<span class='table-everyday-festival'>" + lunanrs[3] + "</span>";
                    } else {
                        if (lunanrs[2] !="") {//农历节气
                            str += "<span class='table-everyday-festival'>" + lunanrs[2] + "</span>";
                        } else {
                            if (lunanrs[1] !="") {
                                str += "<span class='table-everyday-lunar'>" + lunanrs[1] + "</span>";
                            }
                        }
                    }
                }

                str += "</td>";
                week = thisMonth[i].solar[i];
                i++;
                temp++;
            }
            //} else {
            if (temp == 7) {
                str += "</tr><tr>";
                temp = 0;
            }
        }

        //alert(str);
        $("table").innerHTML = str;
        var len = $("table").rows.length;
        if(len > 6 ) {
            if($("table").rows[len-1].cells.length > 0) {
                var trs = $("table").getElementsByTagName("tr");
                for(var i = 0; i<trs.length;i++) {
                    trs[i].style.height ="34px";
                }
            } else {
                $("table").deleteRow(len - 1);
            }
        }
    }

    function arrSum(array) {
        var sum = 0;
        for (var i = 0; i < array.length; i++) {
            sum += array[i];
        }
    return sum;
    }
    //function test() {
    //    var s1 = new Date("1901/02/01");
    //    var s2 = new Date("1900/01/31");
    //    var r = (s1 - s2) / (24 * 3600 * 1000);
    //    return r;
    //}
    function init() {
        var year = $("year");
        var month = $("month");
        var ystr = "";
        var mstr = "";
        var date = new Date();
        for (var i = 1900; i <= 2100; i++) {
            if (i == date.getFullYear()) {
                ystr += "<option selected='true' value=\'" + i + "\'>" + i + "年" + "</option>";
            } else {
                ystr += "<option value=\'" + i + "\'>" + i + "年" + "</option>";
            }
        }
        for (var j = 1; j <= 12; j++) {
            if (j == (date.getMonth() + 1)) {
                mstr += "<option selected='true' value=\'" + j + "\'>" + j + "月" + "</option>";
            } else {
                mstr += "<option value=\'" + j + "\'>" + j + "月" + "</option>";
            }
        }
        year.innerHTML = ystr;
        month.innerHTML = mstr;
        addEvent($("year"), "change", showDates);
        addEvent($("month"), "change", showDates);
        addEvent($("yearPre"), "click", function () {
            $("year").value = $("year").value - 1;
            showDates();
        });
        addEvent($("yearNext"), "click", function () {
            $("year").value = ($("year").value - 1) + 2;
            showDates();
        });
        addEvent($("monthPre"), "click", function () {
            $("month").value = $("month").value - 1;
            showDates();
        });
        addEvent($("monthNext"), "click", function () {
            $("month").value = ($("month").value - 1) + 2;
            showDates();
        });
        addEvent($("returnToday"), "click", function () {
            location.reload();
        });
        show();
        showDates();

    }
    function test(fn) {
        var start = new Date().getTime();//
        fn();
        var end = new Date().getTime();
        alert( (end-start)+"ms");
    }

    init();




