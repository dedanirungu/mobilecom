const createTable = async (table_name, schema_str) => {
  
  return new Promise((resolve, reject) => {

    db.transaction(function (txn) {
      txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='" + table_name + "'",
          [],
          function (tx, res) {
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS ' + table_name, []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS ' + table_name + '(id INTEGER PRIMARY KEY AUTOINCREMENT, ' + schema_str + ')',
                []
              );
            }

            resolve(true);
          }
      );
    });
    
  });
    
};


export const createSettingTable = async  () => {
  await createTable('setting', 'name VARCHAR(30), data VARCHAR(255)');
};


export const createForwardTable =  async () => {
  await createTable('forward', 'name VARCHAR(30), phone INT(15)');
};

export const createIgnoreTable =  async () => {
  await createTable('ignore', 'name VARCHAR(30), phone INT(15)');
};

export const createSmsinTable =  async () => {
  await createTable('smsin', 'phone VARCHAR(15), message_id INTEGER, sms Text, date_sent DATETIME, completed BOOLEAN, successful BOOLEAN');
};

export const createSmsoutTable = async  () => {
  await createTable('smsout', 'phone VARCHAR(15), sms Text, date_sent DATETIME, completed BOOLEAN, successful BOOLEAN');
};



export const saveRecord = async ( table_name, record, record_id=0 ) => {

  return new Promise((resolve, reject) => {

    db.transaction(function (txn) {

        var sql = '';
        var successful = false;

        if(record_id){

            var update_str = [];
            for(let i = 0; i < record.length; i++){
                update_str.push(record[i][0] + " = '" + record[i][1] + "'");
            }

            sql = "UPDATE " + table_name + " SET " + update_str.join(', ') + " WHERE id = " + record_id
        }else{

            var field_str = [];
            var update_str = [];
            for(let i = 0; i < record.length; i++){
                field_str.push(record[i][0]);
                update_str.push("'" + record[i][1] + "'");
            }

            sql = "INSERT INTO " + table_name + " (" + field_str.join(', ') + ") VALUES (" + update_str.join(', ') + ")";

        }

        txn.executeSql(
          sql,
          [],
          function (tx, res) {

            if (res.rowsAffected > 0) {
                successful = true;
            }
          } ,
          function (tx, error) {
            reject(error);
          }, 
        );

        resolve(successful);
    });  
  });

};


const countRecord = async (count_sql) => {
  
  return new Promise((resolve, reject) => {

    db.transaction(function (txn) {

      txn.executeSql( 
        count_sql,
        [],
        function (tx, res) { 

          var tmp_result = res.rows.item(0); 

          resolve(tmp_result.total);
          
        },
        function (tx, error) {
            reject(error);
        },   
      );

    });
    
  });
    
};

const fetchRecord = async (select_sql) => {
  
  return new Promise((resolve, reject) => {
    
    db.transaction(function (txn) {
      
      txn.executeSql( 
        select_sql,
        [],
        function (tx, res) {
          
          var tmp_ignore_list = [];
          for (let i = 0; i < res.rows.length; ++i) {
            tmp_ignore_list.push(res.rows.item(i));
          }

          resolve(tmp_ignore_list);
          
        },
        function (tx, error) {
          reject(error);
      }, 
    );

    });
    
  });
    
};


export const listRecord = async ( table_name, where_list='', offset=0, limit=10, field_list='*' ) => {

    var sql = "";
    var listing = [];
    var total = 0;
    var end_page = 0;

    if(where_list.length > 0){ 
      sql = sql + " WHERE " + where_list 
    }

    var count_sql = "SELECT COUNT(*) AS total FROM "+ table_name + sql ;
    var select_sql = "SELECT " + field_list + " FROM " + table_name  + sql + " LIMIT " + limit + " OFFSET "+ offset;
    
    total = await countRecord(count_sql);
    listing = await fetchRecord(select_sql);
    end_page = Math.ceil(total/limit)

    return [listing, total] 

};



export const saveToStorage = async (key, value) => { 

    var listing = [];
    var total = 0;

    var where_list = "name='" + key + "'"

    var count_sql = "SELECT COUNT(*) AS total FROM setting WHERE " + where_list ;
    var select_sql = "SELECT * FROM setting WHERE "   + where_list;
    
    total = await countRecord(count_sql);
    listing = await fetchRecord(select_sql);  

    if (listing.length) {
        var record = [
            ['data', value],
        ];
        
        await saveRecord('setting', record, listing[0].id);
          
    }else{
        var record = [
            ['name', key],
            ['data', value],
        ];
        
        await saveRecord('setting', record);        
    }

  
}

export const getFromStorage = async (key, default_val=false) => {

  var where_list = "name='" + key + "'"
  var select_sql = "SELECT * FROM setting WHERE "   + where_list;
  
  var listing = await fetchRecord(select_sql); 

  if (listing.length) {
    return listing[0].data;
  } else {
    return default_val;
  }


}

export const timeConverter = (UNIX_timestamp)=> {

    var a = new Date(UNIX_timestamp);
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getUTCHours();
    var min = a.getUTCMinutes();
    var sec = a.getUTCSeconds();

    month = (month>=10) ? month : '0' + month;
    date = (date>=10) ? date : '0' + date;
    hour = (hour>=10) ? hour : '0' + hour;
    min = (min>=10) ? min : '0' + min;
    sec = (sec>=10) ? sec : '0' + sec;

    var time = date + '-' + month + '-' + year + ' ' + hour+ ':' + min + ':' + sec ;

    return time;
}