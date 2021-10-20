// Core packages

// Third party packages
import SmsAndroid from 'react-native-get-sms-android';
import {
    saveToStorage,
    getFromStorage,
    saveRecord
} from "./Helper";
import axios from 'axios';


/**
 * Script start
 */
class SMSService {

    /**
     * Prepare Incoming SMS list
     *
     * @since 1.0.0
     */
    async prepareInComingSMS(): Promise < void > {

        min_date = 1613310063177;
        max_date = 1793310063177;

        const now = new Date();
        tmp_max_date = now.getTime();
        max_date = tmp_max_date;

        var tmp_min_date = await getFromStorage('max_date');

        if (tmp_min_date) {
            min_date = parseInt(tmp_min_date);
        }

        await saveToStorage('min_date', '' + min_date);
        await saveToStorage('max_date', '' + max_date);

        /* List SMS messages matching the filter */
        var filter = {
            box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            read: 0, // 0 for unread SMS, 1 for SMS already read
            indexFrom: 0, // start from index 0
            maxCount: 100, // count of SMS to return each time
            minDate: min_date, // timestamp (in milliseconds since UNIX epoch)
            maxDate: max_date, // timestamp (in milliseconds since UNIX epoch)
        };


        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log('Failed with this error: ' + fail);
            },
            (count, smsList) => {
                var arr = JSON.parse(smsList);

                arr.forEach(function (object) {

                    db.transaction(function (txn) {

                        var sql = "INSERT INTO smsin (phone, message_id, sms, date_sent) VALUES ('" + object.address + "', " + object._id + ", '" + object.body + "', '" + object.date + "')"

                        txn.executeSql(
                            sql,
                            [],
                            function (tx, res) {
                                if (res.rowsAffected > 0) {
                                    forwardSMS()
                                }

                            }
                        );

                    });

                });
            },
        );
    }

    /**
     * Forward Incoming SMS list
     *
     * @since 1.0.0
     */
    async forwardInComingSMS(): Promise < void > {

        console.log('forwardInComingSMS');

        var forward_url = await getFromStorage('forward_url');
        var secret_key = await getFromStorage('secret_key');
        var select_sql = "SELECT * FROM smsin WHERE successful=0 OR successful is null";

        db.transaction(function (txn) {

            txn.executeSql(
                select_sql,
                [],
                function (tx, res) {

                    for (let i = 0; i < res.rows.length; ++i) {

                        var tmp_item = res.rows.item(i);

                        console.log(forward_url + "?secret_key=" + secret_key + "&action=post&phone=" + tmp_item.phone + "&sms=" + tmp_item.sms + "&date_sent=" + tmp_item.date_sent)

                        axios.get(forward_url + "?secret_key=" + secret_key + "&action=post&phone=" + tmp_item.phone + "&sms=" + tmp_item.sms + "&date_sent=" + tmp_item.date_sent)
                            .then(result => {

                                console.log('');
                                console.log('result.data.successful');
                                console.log(result.data.successful);
                                console.log('');
                                console.log('');

                                if (result.data.successful) {

                                    var record = [
                                        ['successful', 1],
                                        ['completed', 1],
                                    ];

                                    saveRecord('smsin', record, tmp_item.id);

                                }

                            }).catch(function (error) {
                                //alert(error.message);
                                console.log('There has been a problem with your fetch operation: ' + error.message);
                            });

                    }

                }
            );

        });
    }

    /**
     * Prepare Out Going SMS list
     *
     * @since 1.0.0
     */
    async prepareOutGoing(): Promise < void > {

        var forward_url = await getFromStorage('forward_url');
        var secret_key = await getFromStorage('secret_key');

        axios.get(forward_url + "?secret_key=" + secret_key + "&action=list")
        .then(result => {

            let json = result.data;

            if (json.successful && json.counter >= 1) {

                for (let i = 0; i < json.items.length; ++i) {

                    var item = json.items[i];
                    const now = new Date();

                    db.transaction(function (txn) {

                        var sql = "INSERT INTO smsout (phone, sms, date_sent ) VALUES ('" + item.phone + "', '" + item.sms + "', '" + Math.round(now.getTime() / 1000) + "')"

                        txn.executeSql(
                            sql,
                            [],
                            function (tx, res) {

                                if (res.rowsAffected > 0) {
                                    alert('Record added Successfully');
                                } else {
                                    alert('Record addition Failed');
                                }

                            }
                        );

                    });

                }

            }

        }).catch(function (error) {
            //alert(error.message);
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    /**
     * Send Out Going SMS list
     *
     * @since 1.0.0
     */
    async sendOutGoing(): Promise < void > {

        var forward_url = getFromStorage('forward_url');
        var select_sql = "SELECT * FROM smsout WHERE complete=1";

        db.transaction(function (txn) {

            txn.executeSql(
                select_sql,
                [],
                function (tx, res) {

                    for (let i = 0; i < res.rows.length; ++i) {

                        var tmp_item = res.rows.item(i);

                        SmsAndroid.autoSend(
                            tmp_item.phone,
                            tmp_item.sms,
                            (fail) => {
                                console.log('Failed with this error: ' + fail);
                            },
                            (success) => {
                                console.log('SMS sent successfully');
                            },
                        );

                        if (json.successful) {

                            var sql = "UPDATE smsin SET successful = 1, completed = 1,  WHERE id = " + tmp_item.id

                            txn.executeSql(
                                sql,
                                [],
                                function (tx, res) {

                                    if (res.rowsAffected > 0) {
                                        alert('Record added Successfully');
                                    } else {
                                        alert('Record addition Failed');
                                    }

                                }
                            );
                        }

                    }

                }
            );

        });

    }

}

export default SMSService;