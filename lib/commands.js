const db = require('./config/connection');

class Sqlcommnands  {
    constructor(first_name, last_name, ){
        this.first_name = first_name;
        this
    };

    getAllEmployees() {
        const sql = 'SELECT * FROM employees'
        db.query(sql, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
            console.log(rows)
        });
    }   

}

module.exports = Sqlcommnands