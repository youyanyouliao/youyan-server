var userApi = function (app, conn) {
    //分页 查询用户 根据手机号查询
    var getUserByPagination = async function (currentPage, pageSize, phone, res) {
        let total = await getAllUserNum();
        total = total[0].num;
        return new Promise((resolve, reject) => {
            let sqlStr = '';
            if (phone) {
                sqlStr = 'select * from user where phone like "%' + phone + '%" limit ' + (currentPage - 1) * pageSize + ',' + pageSize
                console.log(1, sqlStr);
            } else {
                sqlStr = 'select * from user limit ' + (currentPage - 1) * pageSize + ',' + pageSize
                console.log(2, sqlStr);
            }
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
    //查询用户总数
    var getAllUserNum = function (res) {
        return new Promise((resolve, reject) => {
            let sqlStr = 'select count(*) as num from user'
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
    var deleteUserById = function (ids, res) {
        return new Promise((resolve, reject) => {
            let sqlStr = 'delete from user where id = ' + ids;
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
    //获取用户信息接口
    app.get('/adminApi/getUserList', async (req, res) => {
        getUserByPagination(req.query.currentPage, req.query.pageSize, req.query.phone, res);
    })
    //根据Id删除某个用户
    app.post('/adminApi/deleteUserById', (req, res) => {
        deleteUserById(req.body.id, res);
    })
}
module.exports = {
    userApiInit: userApi
}