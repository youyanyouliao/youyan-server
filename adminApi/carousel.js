const CONSTANT = require('../constant/constant')
var carouselApi = function (app, conn, fs) {
    //查询轮播图
    var getAllCarousel = function (res) {
        return new Promise((resolve, reject) => {
            const sqlStr = 'select * from carousel'
            conn.query(sqlStr, (err, results) => {
                if (res) {
                    if (err) {
                        console.log('异常', err)
                        reject(err);
                        return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
                    }
                    resolve(results);
                    res.json({
                        err_code: 0, message: results, affectedRows: 0
                    })

                } else {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                }

            })
        })
    }
    //保存轮播图
    var saveCarousel = function (carouselImg, res) {
        const sqlStr = 'insert into carousel set ?'
        conn.query(sqlStr, carouselImg, (err, results) => {
            if (err) {
                console.log('异常', err)
                return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
            }
            if (results.affectedRows !== 1) return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
            res.json({ err_code: 0, message: '请求成功', affectedRows: results.affectedRows })
        })
    }
    //根据Id获取图片
    var getImageById = function (ids, res) {
        return new Promise((resolve, reject) => {
            const sqlStr = 'select * from carousel where id ="' + ids + '"'
            conn.query(sqlStr, (err, results) => {
                if (res) {
                    if (err) {
                        console.log('异常', err)
                        reject(err);
                        return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
                    }
                    resolve(results);
                    res.json({
                        err_code: 0, message: results, affectedRows: 0
                    })

                } else {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                }

            })
        })
    }
    //根据id 删除某条记录
    var deleteCarouselById = function (ids, res) {
        return new Promise((resolve, reject) => {
            let sqlStr = 'delete from carousel where id = ' + ids;
            conn.query(sqlStr, (err, results) => {
                if (res) {
                    if (err) {
                        console.log('异常', err)
                        reject(err);
                        return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
                    }
                    resolve(results);
                    res.json({
                        err_code: 0, message: results, affectedRows: 0
                    })

                } else {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                }

            })
        })
    }
    //上传轮播图接口
    app.post('/adminApi/uploadCarousel', (req, res) => {
        var nowTimeStamp = new Date().getTime();
        var des_file = "./server/image/carousel/" + nowTimeStamp + "-" + req.files[0].originalname;
        fs.readFile(req.files[0].path, (err, data) => {
            fs.writeFile(des_file, data, err => {
                if (err) {
                    console.log(err);
                    return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
                } else {
                    let carouselObj = {
                        id: new Date().getTime(),
                        imgUrl: '/static/image/carousel/' + nowTimeStamp + "-" + req.files[0].originalname,
                        createTime: CONSTANT.getCurrentDateTime()
                    }
                    saveCarousel(carouselObj, res);
                }
            })
        })
    })
    //获取所有轮播图接口
    app.get('/adminApi/getCarouselList', async (req, res) => {
        getAllCarousel(res);
    })
    //删除轮播图 根据Id
    app.post('/adminApi/deleteCarouselById', async (req, res) => {
        //根据Id查找图片名字
        let imgInfo = await getImageById(req.body.id);
        //根据图片名删除文件
        let imgName = imgInfo[0].imgUrl.split('/carousel/')[1];
        fs.unlinkSync('./server/image/carousel/' + imgName);
        //删除数据库中的图片记录
        deleteCarouselById(imgInfo[0].id,res);
    })

}
module.exports = {
    carouselApiInit: carouselApi
}