const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.array', () => {

    //--------------Dante.date.ensureArray--------------------->
    it('Dante.Array.ensureArray', () => {
        //确保指定值始终为一个数组
        //定义一个数字变量
        let num = 1;
        //定义一个数组变量
        let arrayNums = [1, 2, 3];

        //确保返回值始终为一个数组
        let array = Dante.Array.ensureArray(num);
        let array2 = Dante.Array.ensureArray(arrayNums);

        assert.equal(true, array instanceof Array);
        assert.equal(true, array instanceof Array);
    });

    //--------------Dante.date.mapDictionary--------------------->
    it('Dante.Array.mapDictionary', () => {
        //在有时候我们可能需要将一个对象数组根据指定字段值作为属性名称的对象
        //例如:  [{id:'a',name:'hello'},{id:'b',name:'no'}] -- > {a:{id:'a',name:'hello'},b:{id:'b',name:'no'}  }

        let arrayJson = [{
            id: 'a',
            name: 'hello',
            short: 'pm1'
        }, {
            id: 'b',
            name: 'no',
            short: 'pm2'
        }];

        let results = '{"pm1":{"id":"a","name":"hello","short":"pm1"},"pm2":{"id":"b","name":"no","short":"pm2"}}';
        //根据short字段将 json数组 转成 哈希对象
        let hashJson = Dante.Array.mapDictionary(arrayJson, 'short');
        assert.equal(JSON.stringify(hashJson), results);

        //当然也可以选择性的转换数组中的项，例如可以过滤掉不需要的数据
        let results2 = '{"pm2":{"id":"b","name":"no","short":"pm2"}}';
        //只转换 short = pm2的数据
        let hashJson2 = Dante.Array.mapDictionary(arrayJson, 'short', 'pm2');
        assert.equal(JSON.stringify(hashJson2), results2);

        let results3 = '{"pm1":{"id":"a","name":"hello","short":"pm1"},"pm2":{"id":"b","name":"no","short":"pm2"}}';
        //可以自定义函数进行过略 例如：下边的过略所有name等于yes的项
        let hashJson3 = Dante.Array.mapDictionary(arrayJson, 'short', (item) => item.name != 'yes');
        assert.equal(JSON.stringify(hashJson3), results3);
    });

    //--------------Dante.date.mapDictionary2--------------------->
    it('Dante.Array.mapDictionary2', () => {
        let arrayJson = [{
            id: '1',
            name: 'ss'
        }, {
            'id': 2,
            name: 'bb'
        }];

        let results = '{"1":"ss","2":"bb"}';
        //根据short字段将 json数组 转成 哈希对象
        let hashJson = Dante.Array.mapDictionary2(arrayJson, 'id', 'name');
        assert.equal(JSON.stringify(hashJson), results);
    });

    //--------------Dante.date.mapDictionary2--------------------->
    it('Dante.Array.mapDictionary2', () => {
        let arrayJson = [{
            id: '1',
            name: 'ss'
        }, {
            'id': 2,
            name: 'bb'
        }];

        //根据short字段将 json数组 转成 哈希对象
        assert.equal('1,2', Dante.Array.arrayJoin(arrayJson, 'id'));
        assert.equal('1-2', Dante.Array.arrayJoin(arrayJson, 'id', '-'));
    });

    //--------------Dante.date.mapDictionary2--------------------->
    it('Dante.Array.mapDictionary2', () => {
        let arrayJson = [{
            id: '1',
            name: 'ss'
        }, {
            'id': 2,
            name: 'bb'
        }, {
            'id': '1',
            name: null
        }]
        let r1 = Dante.Array.valuesArray(arrayJson, 'id'); // > [1, 2]
        let r2 = Dante.Array.valuesArray(arrayJson, 'id', true); // > [1, 2]
        let r3 = Dante.Array.valuesArray(arrayJson, 'name', true); // > ['ss', 'bb']
        let r4 = Dante.Array.valuesArray(arrayJson, 'name', true, true); // > ['ss', 'bb', null]

        //根据short字段将 json数组 转成 哈希对象
        assert.equal('1,2,1', r1.join(','));
        assert.equal('1,2', r2.join(','));
        assert.equal('ss,bb', r3.join(','));
        assert.equal('ss,bb,', r4.join(','));
    });

    //--------------Dante.date.each--------------------->
    it('Dante.Array.each', () => {
        let results = [1, 2, 3, 4];
        let results2 = [];
        Dante.Array.each(results, (v) => results2.push(v));
        assert.equal(results.join(','), results2.join(','));
    });

    //--------------Dante.date.blockEach--------------------->
    it('Dante.Array.blockEach', () => {
        let results = [1, 2, 3, 4];
        let results2 = [];
        Dante.Array.blockEach(results, (v) => results2.push(v));
        assert.equal(results.join(','), results2.join(','));
    });

    //--------------Dante.date.indexOf--------------------->
    it('Dante.Array.indexOf', () => {
        let results = [1, 2, 3, 4];
        let results2 = [];
        assert.equal(1, Dante.Array.indexOf([1, 2, 4], 2));
        assert.equal(-1, Dante.Array.indexOf([1, 2, 4], '2'));
        assert.equal(1, Dante.Array.indexOf([1, 2, 4], '2', true));
    });

    //--------------Dante.date.contains--------------------->
    it('Dante.Array.contains', () => {
        let results = [1, 2, 3, 4];
        let results2 = [];
        assert.equal(true, Dante.Array.contains([1, 2, 4], 2));
        assert.equal(false, Dante.Array.contains([1, 2, 4], '2'));
        assert.equal(true, Dante.Array.contains([1, 2, 4], '2', true));
    });

    //--------------Dante.date.filter--------------------->
    it('Dante.Array.filter', () => {
        let results = [1, 2, 3, 4];
        let results2 = [];
        assert.equal('1,4', Dante.Array.filter([1, 2, 4], (item) => item != 2).join(','));
    });

    //--------------Dante.date.filterEmpty--------------------->
    it('Dante.Array.filterEmpty', () => {
        let results = [1, 2, 3, 4, '', null, undefined];
        assert.equal('1,2,3,4,', Dante.Array.filterEmpty(results).join(','));
    });

    //--------------Dante.date.querySplice--------------------->
    it('Dante.Array.querySplice', () => {
        let results = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let deleteds = Dante.Array.querySplice(results, (v) => v % 2 == 0);
        assert.equal('2,4,6,8', deleteds.join(','));
        assert.equal('1,3,5,7,9', results.join(','));
    });

    //--------------Dante.date.isEmptyArray--------------------->
    it('Dante.Array.isEmptyArray', () => {
        let results = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        assert.equal(false, Dante.Array.isEmptyArray(results));
        assert.equal(true, Dante.Array.isEmptyArray([]));
        assert.equal(true, Dante.Array.isEmptyArray(null));
    });

    //--------------Dante.date.valuesObject--------------------->
    it('Dante.Array.valuesObject', () => {
        let obj = {
            name: 'beven',
            age: 999,
            sex: '2'
        };

        assert.equal('beven,999', Dante.Array.valuesObject(obj, ['name', 'age']).join(','));
    });

});