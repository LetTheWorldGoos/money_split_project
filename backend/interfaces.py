from flask import Flask, request, jsonify  # make_response, send_from_directory
import flask_cors
import json
from db_conn import mysql_conn
from utils import *

# flask
app = Flask(__name__)
# mysql
init_conn = mysql_conn()
db_conn = init_conn.start_conn()
# Cross origin
flask_cors.CORS(app, supports_credentials=False)
# json specify
app.config['JSON_AS_ASCII'] = False

# 0.0 Userinfo
@app.route('/get_info', methods=['GET'])
def get_info():
    if request.method == 'GET':
        user = request.args.get('user_id', '')
        select_sql = f'select UserName from User where UserId = {user}'

        cols, results = init_conn.ddl_db(db_conn, select_sql)
        # get ans as json
        list_rsl = cur_to_dict(cols, results)
        if len(list_rsl) >= 1:
            ans = {
                "code": 200,
                "data":list_rsl[0]
            }
            return jsonify(ans)
        else:
            return jsonify({"code": 500,
                            "message": f"cannot find use id {user}"})
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


# 1.1 Add new Transaction(add trigger needed)
@app.route('/group/add_transaction', methods=['POST'])
def group_add_transaction():
    if request.method == 'POST':
        user_id, group_id, lend_id, amount, category, description = request.json['user_id'], request.json['group_id'], \
                                                                    request.json['lend_id'], request.json['amount'], \
                                                                    request.json['category'], request.json[
                                                                        'description']
        insert_sql = f'insert into Bill(Amount, LendId, GroupId, Category, Description) \
                        VALUES ({amount}, {lend_id}, {group_id}, "{category}", "{description}")'
        rsl = init_conn.ddl_db_uid(db_conn, insert_sql)
        if rsl:
            return jsonify({
                "code": 200
            })
        else:
            return jsonify({"code": 500,
                            "message": f"insert failed."})
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


# 1.2 Settle Transaction
@app.route('/group/settle_transaction', methods=['POST'])
def group_settle():
    if request.method == 'POST':
        user_id, group_id, borrow_id = request.json['user_id'], request.json['group_id'], request.json['borrow_id']
        update_sql = f'UPDATE Transaction SET PaidStatus = "Paid" \
                     WHERE BillId IN (SELECT BillId FROM Bill WHERE GroupId = {group_id}) AND BorrowId = {borrow_id} \
                     AND PaidStatus = "Process";'
        rsl = init_conn.ddl_db_uid(db_conn, update_sql)
        if rsl:
            return jsonify({
                "code": 200
            })
        else:
            return jsonify({"code": 500,
                            "message": f"insert failed."})
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


# 1.3
@app.route('/group/records', methods=['GET'])
def group_get_records():
    if request.method == 'GET':
        content = request.args.get('group_id', '')
        select_sql = f'select u.UserName, b.Amount, b.Date \
                     from Bill b join User u on u.UserId = b.LendId where GroupId = {content} order by b.Date'

        cols, results = init_conn.ddl_db(db_conn, select_sql)
        # get ans as json
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


# 1.4
# here 0 is not set in the result
@app.route('/group/loans', methods=['GET'])
def group_get_loans():
    if request.method == 'GET':
        group_id = request.args.get('group_id', '')
        user_id = request.args.get('user_id', '')
        # debit
        select_sql1 = f'select u.UserName as UserName, ROUND(sum(t.Amount),2) as LendAmount from Transaction t join User u on u.UserId = t.BorrowId join Bill b using(BillId) \
                        where t.LendId = {user_id} and PaidStatus = "Process" and b.GroupId = {group_id} \
                        group by t.BorrowId;'
        cols1, results1 = init_conn.ddl_db(db_conn, select_sql1)
        # credit
        select_sql2 = f'select u.UserName as UserName, ROUND(sum(t.Amount),2) as BorrowAmount \
                        from Transaction t join User u on u.UserId = t.LendId join Bill b using(BillId) \
                        where t.BorrowId = {user_id} and PaidStatus = "Process" and b.GroupId = {group_id} \
                        group by t.LendId;'
        cols2, results2 = init_conn.ddl_db(db_conn, select_sql2)
        # print(results1)
        # print(results2)
        list_rsl = check_bill(results1, results2, title='UserName')
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


# 1.5
@app.route('/group/members', methods=['GET'])
def group_get_members():
    if request.method == 'GET':
        group_id = request.args.get('group_id', '')
        user_id = request.args.get('user_id', '')
        select_sql = f'select u.UserName, u.UserId from GroupJoin g natural join User u\
                     where GroupId = {group_id} and UserId <> {user_id};'
        cols, results = init_conn.ddl_db(db_conn, select_sql)
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


# 2.1
@app.route('/user/search', methods=['GET'])
def get_user_search():
    if request.method == 'GET':
        content = request.args.get('group_name', '')
        select_content = f"SELECT p.GroupName, p.GroupId FROM PrivateGroup p WHERE p.GroupName LIKE '%{content}%'"
        cols, results = init_conn.ddl_db(db_conn, select_content)
        # get ans as json
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})

# 2.2
@app.route('/user/delete', methods=['POST'])
def get_user_delete():
    if request.method == 'POST':
        user_id, group_id = request.json['user_id'], request.json['group_id']
        count_process = f'SELECT COUNT(*) \
                        FROM Transaction t JOIN Bill b on b.BillId = t.BillId \
                        WHERE t.BorrowId = {user_id} AND b.GroupId = {group_id} AND t.PaidStatus = "Process"\
                        GROUP BY t.BorrowId;'
        cols, count = init_conn.ddl_db(db_conn, count_process)
        if count == 0:
            delete_process = f'DELETE FROM GroupJoin WHERE UserId = {user_id} AND GroupId = {group_id}'
            rsl = init_conn.ddl_db_uid(db_conn, delete_process)
            if rsl:
                return jsonify({"code": 200,
                                "status": "success"})
            else:
                return jsonify({"code": 200,
                                "message": "delete failed."})
        else:
            return jsonify({"code": 200,
                            "status": "remain unpaid transaction"})
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})

# 2.3
@app.route('/user/select_group', methods=['GET'])
def get_user_select_group():
    if request.method == 'GET':
        content = request.args.get('user_id', '')
        select_content = f'SELECT p.GroupName, p.GroupId FROM PrivateGroup p WHERE p.GroupId IN (SELECT GroupId FROM GroupJoin WHERE UserId = {content})'
        cols, results = init_conn.ddl_db(db_conn, select_content)
        # get ans as json
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


# 2.4
@app.route('/user/ra', methods=['GET'])
def get_user_ra():
    if request.method == 'GET':
        content = request.args.get('user_id', '')
        select_content = f'(SELECT u1.Username as Name, -(t1.Amount) as Amount, b1.Category, t1.Date \
                        FROM Transaction t1 JOIN Bill b1 USING(BillId) JOIN User u1 ON t1.LendId = u1.UserId \
                        WHERE t1.BorrowId = {content}) \
                        UNION\
                        (SELECT u2.Username as Name, t2.Amount as Amount, b2.Category, t2.Date \
                        FROM Transaction t2 JOIN Bill b2 USING(BillId) JOIN User u2 ON t2.BorrowId = u2.UserId \
                        WHERE t2.LendId = {content})  \
                        ORDER BY Date DESC \
                        LIMIT 10;'
        cols, results = init_conn.ddl_db(db_conn, select_content)
        # get ans as json
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})

# 2.5
@app.route('/user/status_category',methods=['GET'])
def user_status_category():
    if request.method == 'GET':
        user_id = request.args.get('user_id', '')
        select_sql1 = f'SELECT Category, ROUND(SUM(T.Amount),2) AS lend FROM Transaction T JOIN Bill B ON T.BillId = B.BillId \
                        WHERE T.LendId = {user_id} AND PaidStatus = "Process" \
                        GROUP BY Category;'
        cols1, results1 = init_conn.ddl_db(db_conn, select_sql1)

        select_sql2 = f'SELECT Category, ROUND(SUM(T.Amount),2) AS borrow FROM Transaction T JOIN Bill B ON T.BillId = B.BillId \
                        WHERE T.BorrowId = {user_id} AND PaidStatus = "Process" \
                        GROUP BY Category;'
        cols2, results2 = init_conn.ddl_db(db_conn, select_sql2)
        # print(results1)
        # print(results2)
        list_rsl = check_bill(results1, results2, title='Category')
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "message": f"method{request.method} not supported"})


if __name__ == '__main__':
    app.run(debug=True, port=8888, host='127.0.0.1')
