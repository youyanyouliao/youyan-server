// 查所有
var testApi = function (app, conn) {
    app.get('/api/getheros', (req, res) => {
        // 定义SQL语句
        const sqlStr = 'select * from user where age=18'
        conn.query(sqlStr, (err, results) => {
            console.log(results)
            console.log(err);
            if (err) return res.json({ err_code: 1, message: '获取失败', affectedRows: 0 })
            res.json({
                err_code: 0, message: results, affectedRows: 0
            })
        })
    })
    // 根据ID 获取相关数据
    app.get('/api/gethero', (req, res) => {
        const id = req.query.id
        const sqlStr = 'select * from user where id = ?'
        conn.query(sqlStr, id, (err, results) => {
            if (err) return res.json({ err_code: 1, message: '获取数据失败', affectedRows: 0 })
            if (results.length !== 1) return res.json({ err_code: 1, message: '数据不存在', affectedRows: 0 })
            res.json({
                err_code: 0,
                message: results[0],
                affectedRows: 0
            })
        })
    })
    // 根据ID 删除数据
    app.get('/api/delhero', (req, res) => {
        const id = req.query.id
        const sqlStr = 'update user set isdel = 1 where id=?'
        conn.query(sqlStr, id, (err, results) => {
            if (err) return res.json({ err_code: 1, message: '删除英雄失败', affectedRows: 0 })
            if (results.affectedRows !== 1) return res.json({ err_code: 1, message: '删除英雄失败', affectedRows: 0 })
            res.json({ err_code: 0, message: '删除英雄成功', affectedRows: results.affectedRows })
        })
    })
    //增加
    app.post('/api/addhero', (req, res) => {
        const hero = req.body
        console.log(hero)
        const sqlStr = 'insert into user set ?'
        conn.query(sqlStr, hero, (err, results) => {
            if (err) return res.json({ err_code: 1, message: '添加失败', affectedRows: 0 })
            if (results.affectedRows !== 1) return res.json({ err_code: 1, message: '添加失败', affectedRows: 0 })
            res.json({ err_code: 0, message: '添加成功', affectedRows: results.affectedRows })
        })
    })
    //更新
    app.post('/api/updatehero', (req, res) => {
        const sqlStr = 'update user set ? where id = ?'
        conn.query(sqlStr, [req.body, req.body.id], (err, results) => {
            if (err) return res.json({ err_code: 1, message: '更新英雄失败', affevtedRows: 0 })
            //影响行数不等于1
            if (results.affectedRows !== 1) return res.json({ err_code: 1, message: '更新的英雄不存在', affectedRows: 0 })
            res.json({ err_code: 0, message: '更新成功', affectedRows: results.affectedRows })
        })
    })
}
module.exports = {
    testApi:testApi
}