const CONSTANT = require('../constant/constant')
var activityApi = function (app, conn, fs) {
    //分页 查询活动
    var getActivityByPagination = async function (currentPage, pageSize, res) {
        let total = await getAllActivityNum();
        total = total[0].num;
        return new Promise((resolve, reject) => {
            let sqlStr = '';
            // if (phone) {
            //     sqlStr = 'select * from user where phone like "%' + phone + '%" limit ' + (currentPage - 1) * pageSize + ',' + pageSize
            //     console.log(1, sqlStr);
            // } else {
            sqlStr = 'select * from activity limit ' + (currentPage - 1) * pageSize + ',' + pageSize
            // console.log(2, sqlStr);
            // }
            conn.query(sqlStr, (err, results) => {
                let tmpResults = {
                    data: results,
                    total: total
                }

                if (res) {
                    if (err) {
                        console.log('异常', err)
                        reject(err);
                        return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
                    }
                    resolve(tmpResults);
                    res.json({
                        err_code: 0, data: tmpResults, affectedRows: 0
                    })

                } else {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(tmpResults);
                }

            })
        })
    }
    //查询活动总数
    var getAllActivityNum = function (res) {
        return new Promise((resolve, reject) => {
            let sqlStr = 'select count(*) as num from activity'
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
    //保存活动
    var saveActivity = function (activity, res) {
        const sqlStr = 'insert into activity set ?'
        conn.query(sqlStr, activity, (err, results) => {
            if (err) {
                console.log('异常', err)
                return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
            }
            if (results.affectedRows !== 1) return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
            res.json({ err_code: 0, message: '请求成功', affectedRows: results.affectedRows })
        })
    }
    //根据id 删除某场活动
    var deleteActivityById = function (ids, res) {
        return new Promise((resolve, reject) => {
            let sqlStr = 'delete from activity where id = ' + ids;
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
    //根据Id 查询某场活动
    var getActivityById = function (ids, res) {
        return new Promise((resolve, reject) => {
            const sqlStr = 'select * from activity where id ="' + ids + '"'
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
    //根据Id 更新某场活动
    var updateActivityById = function (activitys, res) {
        return new Promise((resolve, reject) => {
            console.log(activitys);
            let sqlStr = 'update activity set ? where id = ?'
            conn.query(sqlStr, [activitys, activitys.id], (err, results) => {
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
    //上传封面图片接口
    app.post('/adminApi/uploadActivityCoverImg', (req, res) => {
        var nowTimeStamp = new Date().getTime();
        var des_file = "./server/image/activity/" + nowTimeStamp + "-" + req.files[0].originalname;
        fs.readFile(req.files[0].path, (err, data) => {
            fs.writeFile(des_file, data, err => {
                if (err) {
                    console.log(err);
                    return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
                } else {
                    let activityCoverObj = {
                        id: new Date().getTime(),
                        name: req.files[0].originalname,
                        imgUrl: '/static/image/activity/' + nowTimeStamp + "-" + req.files[0].originalname,
                        createTime: CONSTANT.getCurrentDateTime()
                    }
                    res.json({ err_code: 0, message: activityCoverObj, affectedRows: 0 })
                }
            })
        })
    })
    //新增活动接口
    app.post('/adminApi/addActivity', (req, res) => {
        req.body.id = new Date().getTime();
        req.body.status = "0";
        req.body.isRecommend = "0";
        saveActivity(req.body, res);
    })
    //获取活动信息接口
    app.get('/adminApi/getActivityList', async (req, res) => {
        getActivityByPagination(req.query.currentPage, req.query.pageSize, res);
    })
    //根据Id删除某个活动
    app.post('/adminApi/deleteActivityById', (req, res) => {
        deleteActivityById(req.body.id, res);
    })
    //根据Id更新某场活动
    app.post('/adminApi/editActivity', (req, res) => {
        updateActivityById(req.body, res);
    })
    //根据Id查询某个活动
    app.get('/adminApi/getActivityById', async (req, res) => {
        getActivityById(req.query.id, res);
    })
}
module.exports = {
    activityApiInit: activityApi
}