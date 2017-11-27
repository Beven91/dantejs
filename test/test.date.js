const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.date', () => {

    //-----------Dante.Date.format------------------------>
    it("Dante.Date.format ", () => {
        let date = new Date('2016-10-7 15:33:12.055');
        assert.equal('2016', Dante.Date.format(date, "yyyy"));
        assert.equal('10', Dante.Date.format(date, "MM"));
        assert.equal('07', Dante.Date.format(date, "dd"));
        assert.equal('03', Dante.Date.format(date, "hh"));
        assert.equal('15', Dante.Date.format(date, "HH"));
        assert.equal('33', Dante.Date.format(date, "mm"));
        assert.equal('12', Dante.Date.format(date, "s"));
        assert.equal('55', Dante.Date.format(date, "S"));
        assert.equal('2016-10-07 15:33:12', Dante.Date.format(date, "yyyy-MM-dd HH:mm:ss"));
        assert.equal('2016-10-07 03:33:12', Dante.Date.format(date, "yyyy-MM-dd hh:mm:ss"));
    });

    //--------------Dante.Date.isDate--------------------->
    it('Dante.Date.isDate', () => {
        assert.equal(true, Dante.Date.isDate(new Date()));
        assert.equal(false, Dante.Date.isDate(1));
    });

    //--------------Dante.Date.convert--------------------->
    it('Dante.Date.convert', () => {
        let date = Dante.Date.convert('2016-07-24')
        assert.equal('2016-07-24', Dante.Date.format(date, 'yyyy-MM-dd'));
    });


    //--------------Dante.Date.diff--------------------->
    it('Dante.Date.diff', () => {
        let sDate = "2014-01-08 12:10:20";
        let eDate = "2015-02-09 11:09:10";

        //计算sDate与eDate相差多少年
        assert.equal(1, Dante.Date.diff(sDate, eDate, 'y'));

        //计算sDate与eDate相差多少月
        assert.equal(13, Dante.Date.diff(sDate, eDate, 'M'));

        //计算sDate与eDate相差多少天
        assert.equal(396, Dante.Date.diff(sDate, eDate, 'd'));

        //计算sDate与eDate相差多少小时
        assert.equal(9526, Dante.Date.diff(sDate, eDate, 'h'));

        //计算sDate与eDate相差多少分钟
        assert.equal(571618, Dante.Date.diff(sDate, eDate, 'm'));

        //计算sDate与eDate相差多少秒
        assert.equal(34297130, Dante.Date.diff(sDate, eDate, 's'));
    });

    //--------------Dante.Date.dateAdd--------------------->
    it('Dante.Date.dateAdd', () => {

        //时间累加函数：
        //Dante.Date.dateAdd(时间, 数值, '单位');

        let date = "2014-01-08 12:10:20";

        //添加一年
        assert.equal(2015, Dante.Date.dateAdd(date, 1, 'y').getFullYear());

        //添加一个月
        assert.equal(2, Dante.Date.dateAdd(date, 1, 'M').getMonth() + 1);

        //添加一天
        assert.equal(9, Dante.Date.dateAdd(date, 1, 'd').getDate());

        //添加一小时
        assert.equal(13, Dante.Date.dateAdd(date, 1, 'h').getHours());

        //添加一分钟
        assert.equal(11, Dante.Date.dateAdd(date, 1, 'm').getMinutes());

        //添加一秒
        assert.equal(21, Dante.Date.dateAdd(date, 1, 's').getSeconds());

    });


    //--------------Dante.Date.addSeconds--------------------->
    it('Dante.Date.addSeconds', () => {
        let date = "2014-01-08 12:10:20";
        //添加一秒
        assert.equal(21, Dante.Date.addSeconds(date, 1).getSeconds());

    });

    //--------------Dante.Date.addMinutes--------------------->
    it('Dante.Date.addMinutes', () => {
        let date = "2014-01-08 12:10:20";
        assert.equal(11, Dante.Date.addMinutes(date, 1).getMinutes());

    });

    //--------------Dante.Date.addHours--------------------->
    it('Dante.Date.addHours', () => {
        let date = "2014-01-08 12:10:20";
        //添加一小时
        assert.equal(13, Dante.Date.addHours(date, 1).getHours());

    });

    //--------------Dante.Date.addDays--------------------->
    it('Dante.Date.addDays', () => {
        let date = "2014-01-08 12:10:20";
        //添加一天
        assert.equal(9, Dante.Date.addDays(date, 1).getDate());

    });

    //--------------Dante.Date.addMonths--------------------->
    it('Dante.Date.addMonths', () => {
        let date = "2014-01-08 12:10:20";
        //添加一个月
        assert.equal(2, Dante.Date.addMonths(date, 1).getMonth() + 1);

    });

    //测试 addYears
    //--------------Dante.Date.parse--------------------->
    it('Dante.Date.addYears', () => {
        let date = "2014-01-08 12:10:20";
        //添加一年
        assert.equal(2015, Dante.Date.addYears(date, 1).getFullYear());

    });

    //--------------Dante.Date.maxDayOfMonth--------------------->
    it('Dante.Date.maxDayOfMonth', () => {

        //获取指定月份的最大天数
        let date = '2004-01-01';
        assert.equal(31, Dante.Date.maxDayOfMonth(date));

        date = '2004-02-02';
        assert.equal(29, Dante.Date.maxDayOfMonth(date));

        date = '2015-02-01';
        assert.equal(28, Dante.Date.maxDayOfMonth(date));

        date = '2015-04-03';
        assert.equal(30, Dante.Date.maxDayOfMonth(date));

    });

    //--------------Dante.Date.dayOfWeek--------------------->
    it('Dante.Date.dayOfWeek', () => {
        //获取指定时间星期几
        assert.equal('星期四', Dante.Date.dayOfWeek('2004-01-01'));
        assert.equal('星期五', Dante.Date.dayOfWeek('2004-01-02'));
        assert.equal('星期六', Dante.Date.dayOfWeek('2004-01-03'));
        assert.equal('星期日', Dante.Date.dayOfWeek('2004-01-04'));
        assert.equal('星期一', Dante.Date.dayOfWeek('2004-01-05'));
        assert.equal('星期二', Dante.Date.dayOfWeek('2004-01-06'));
    });

    //--------------Dante.Date.clone--------------------->
    it('Dante.Date.clone', () => {
        //克隆时间
        let date = new Date();
        let cloneDate = Dante.Date.clone(date);
        let fmt = "yyyy-MM-dd HH:mm:ss";
        assert.equal(Dante.Date.format(date, fmt), Dante.Date.format(cloneDate, fmt));
    });

    //--------------Dante.Date.datePart--------------------->
    it('Dante.Date.datePart', () => {

        //时间单位值拆分 与date.getDate等函数没有区别，只是综合了一下，
        //仅在框架内部使用，更改了月份+1
        //通过datePart函数可以获取传入时间的指定单位的值
        let date = "2014-01-02 11:01:22:233";

        //获取年份
        assert.equal('2014', Dante.Date.datePart(date, 'y'));

        //获取月份
        assert.equal(1, Dante.Date.datePart(date, 'M'));

        //获取天
        assert.equal(2, Dante.Date.datePart(date, 'd'));

        //获取小时
        assert.equal(11, Dante.Date.datePart(date, 'h'));

        //获取分钟
        assert.equal(1, Dante.Date.datePart(date, 'm'));

        //获取秒
        assert.equal(22, Dante.Date.datePart(date, 's'));

        //获取毫秒
        assert.equal(233, Dante.Date.datePart(date, 'S'));

        //获取星期值
        assert.equal(4, Dante.Date.datePart(date, 'w'));

    });

    //--------------Dante.Date.daysInYear--------------------->
    it('Dante.Date.daysInYear', () => {
        let date = "2015-04-23 12:00:00";
        //获取当前时间在2015年开始的第多少天
        assert.equal(113, Dante.Date.daysInYear(date));
    });

    //--------------Dante.Date.weeksInYears--------------------->
    it('Dante.Date.weeksInYears', () => {
        let date = "2015-01-23 12:00:00";
        //获取当前时间在2015年开始的第几个星期
        assert.equal(4, Dante.Date.weeksInYears(date));

    });


    //--------------Dante.Date.toUnixTimeStamp--------------------->
    it('Dante.Date.toUnixTimeStamp', () => {
        let date = "2015-01-23 12:00:00";
        //将当前设置的时间转换成unix时间戳
        assert.equal(1421985600, Dante.Date.toUnixTimeStamp(date));
    });

    //--------------Dante.Date.unixTimeStampToDate--------------------->
    it('Dante.Date.unixTimeStampToDate', () => {
        let timestamp = "1421985600";
        //将当前设置的时间转换成unix时间戳
        let date = Dante.Date.unixTimeStampToDate(timestamp);
        assert.equal("2015-01-23 12:00:00", Dante.Date.format(date, 'yyyy-MM-dd HH:mm:ss'));
    });

});