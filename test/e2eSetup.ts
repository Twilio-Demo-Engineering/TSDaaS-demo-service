import { exec } from 'child_process';
import * as mysql from 'mysql';

export default () => {
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'example',
    database: 'demo_service_e2e',
  });

  con.connect(function (err) {
    if (err) console.error(err);
    const sql = 'DROP DATABASE demo_service_e2e;';
    con.query(sql, function (err, result) {
      if (err) console.error(err);
      console.log(result);
    });
  });

  exec('prisma migrate deploy');
};
