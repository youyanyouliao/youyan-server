var userApi = function (app, conn) {
    //根据手机号查询用户
    var getUserByPhone = function (phone, res) {
        return new Promise((resolve, reject) => {
            const sqlStr = 'select * from user where phone ="' + phone + '"'
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
    //根据手机号和密码查询用户
    var getUserByPhoneAndPwd = function (phone, pwd, res) {
        return new Promise((resolve, reject) => {
            const sqlStr = 'select * from user where phone = "' + phone + '" and password = "' + pwd + '"'
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
    //注册用户
    var registerUser = function (user, res) {
        const sqlStr = 'insert into user set ?'
        conn.query(sqlStr, user, (err, results) => {
            if (err) {
                console.log('异常', err)
                return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
            }
            if (results.affectedRows !== 1) return res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
            res.json({ err_code: 0, message: '请求成功', affectedRows: results.affectedRows })
        })
    }
    //注册接口
    app.post('/webApi/register', async (req, res) => {
        let result = await getUserByPhone(req.body.phone, '');
        if (result.length >= 1) {
            return res.json({ err_code: 2, message: '已经注册过啦!', affectedRows: 0 })
        } else {
            registerUser(req.body, res)
        }

    })
    //登陆接口
    app.post('/webApi/login', async (req, res) => {
        let result = await getUserByPhoneAndPwd(req.body.phone,req.body.password,'');
        if(result.length == 1){
            req.session.sessionUser = {
                phone:result[0].phone,
                password:result[0].password
            }
             res.json({ err_code: 0, message: '请求成功', affectedRows: 0,user:req.session.sessionUser})
        }else if(result.length > 1){
            res.json({ err_code: 2, message: '数据异常', affectedRows: 0 })
        }else{
            res.json({ err_code: 1, message: '请求失败', affectedRows: 0 })
        }

    })
    //退出登陆接口
    app.post('/webApi/logout', (req, res) => {
        req.session.destroy(err=>{});
        res.json({ err_code: 0, message: '请求成功', affectedRows: 0})
    })
    //获取sessionUser
    app.get('/webApi/getSessionUser',(req,res)=>{
        if(req.session.sessionUser){
            res.json({ err_code: 0, message: '请求成功', affectedRows: 0,user:req.session.sessionUser})
        }else{
            res.json({ err_code: 0, message: '请求成功', affectedRows: 0})
        }
    })

}
module.exports = {
    userApiInit: userApi
}