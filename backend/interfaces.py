import functools
from flask import Flask, request, jsonify, session  # make_response, send_from_directory
import flask_cors

# import json
from db_conn import mysql_conn
from utils import *
from datetime import timedelta
from datetime import datetime
from user import User

# flask
app = Flask(__name__)
# mysql
init_conn = mysql_conn()
db_conn = init_conn.start_conn()
# Cross origin
flask_cors.CORS(app, supports_credentials=False)
# json specify
app.config['JSON_AS_ASCII'] = False
# session key
app.secret_key = 'splitmunity'
app.permanent_session_lifetime = timedelta(hours=1)


# decorator: @login_required
def login_required(func):
    # 修饰内层函数，防止当前装饰器去修改被装饰函数的属性
    @functools.wraps(func)
    def inner(*args, **kwargs):
        # 从session获取用户信息，如果有，则用户已登录，否则没有登录
        username = session.get('username')
        if not username:
            # 这里返回error信息 还是redirect？
            return jsonify({
                "code": 500,
                "status": "user not login"})
            # return redirect(url_for('login'))
        else:
            return func(*args, **kwargs)

    return inner


"""
part 0: login control
"""


# 0.0 register
@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        # username & email are unique
        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        if not username or not password or not email:
            return jsonify({"code": 500, "status": "invalid input"})
        user_rg = User()

        if user_rg.check_user(username, 'Username') or user_rg.check_user(email, 'Email'):
            return jsonify({"code": 500, "status": "user already exist."})

        else:
            user_rg.register(username=username, password=password, email=email)
            return jsonify({"code": 200})
    else:
        return jsonify({
            "code": 500,
            "status": f"method{request.method} not supported"})


# 0.1 login
@app.route('/login', methods=['POST'])
def login():
    # session.permanent = True
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        if not username or not password:
            # flash('Invalid input.')
            return jsonify({"code": 500,
                            "status": "invalid input"})
        user_login = User()
        user_login.login(username)
        if user_login.validate_password(password):
            session['username'] = username
            # print(session)
            return jsonify(
                {"code": 200,

                 # "login": 1,
                 "username": user_login.username,
                 "user_id": int(user_login.get_id())})
        else:
            return jsonify({"code": 500,
                            # "login": 1,
                            "status": "username or password not valid"})
    # return  render_template('[absolute_path]\login.html')
    else:
        return jsonify({
            "code": 500,
            "status": f"method{request.method} not supported"})


# 0.2 logout
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    # remove the username from the session if it's there
    if session.get('username'):
        session.clear()
        return jsonify({"code": 200
                        })
    else:
        return jsonify({"code": 500,
                        "status": "user not login"})


# 0.3 get userinfo
@app.route('/get_info', methods=['GET'])
@login_required
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
                "data": list_rsl[0]
            }
            return jsonify(ans)
        else:
            return jsonify({"code": 500,
                            "status": f"cannot find use id {user}"})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


"""
part 1: group function
"""


# 1.1 Add new Transaction(add trigger needed)
@app.route('/group/add_transaction', methods=['POST'])
@login_required
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
                            "status": f"insert failed."})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 1.2 Settle Transaction
@app.route('/group/settle_transaction', methods=['POST'])
@login_required
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
                            "status": f"insert failed."})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 1.3 Record Transaction
@app.route('/group/records', methods=['GET'])
@login_required
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
                        "status": f"method{request.method} not supported"})


# 1.4 Loans within the group
# here 0 is not set in the result
@app.route('/group/loans', methods=['GET'])
@login_required
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
                        "status": f"method{request.method} not supported"})


# 1.5 Get Members of group
@app.route('/group/members', methods=['GET'])
@login_required
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
                        "status": f"method{request.method} not supported"})


"""
part 2: user function
"""


# 2.1 Search Group(keyword)
@app.route('/user/search', methods=['GET'])
@login_required
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
                        "status": f"method{request.method} not supported"})


# 2.2 Delete Group(delete)
@app.route('/user/delete', methods=['POST'])
@login_required
def get_user_delete():
    if request.method == 'POST':
        user_id, group_id = request.json['user_id'], request.json['group_id']
        count_process = f'SELECT COUNT(*) \
                        FROM Transaction t JOIN Bill b on b.BillId = t.BillId \
                        WHERE t.BorrowId = {user_id} AND b.GroupId = {group_id} AND t.PaidStatus = "Process"\
                        GROUP BY t.BorrowId;'
        cols, count = init_conn.ddl_db(db_conn, count_process)
        # print(cols,count)
        if len(count) == 0:
            delete_process = f'DELETE FROM GroupJoin WHERE UserId = {user_id} AND GroupId = {group_id}'
            rsl = init_conn.ddl_db_uid(db_conn, delete_process)
            if rsl:
                return jsonify({"code": 200
                                })
            else:
                return jsonify({"code": 500,
                                "status": "delete failed."})
        else:
            return jsonify({"code": 500,
                            "status": "remain unpaid transaction"})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 2.3 Select Group
@app.route('/user/select_group', methods=['GET'])
@login_required
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
                        "status": f"method{request.method} not supported"})


# 2.4 Recent Activity
@app.route('/user/ra', methods=['GET'])
@login_required
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
                        "status": f"method{request.method} not supported"})


# 2.5 Loan(borrow & lend) of user by category
@app.route('/user/status_category', methods=['GET'])
@login_required
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
                        "status": f"method{request.method} not supported"})


# 2.6 search joined event
@app.route('/user/search_join_event', methods=['GET'])
@login_required
def search_event_join():
    if request.method == 'GET':
        UserId = request.args.get('user_id', '')
        select_sql = f'SELECT * FROM PublicActivity natural join ActivityJoin where UserId = {UserId}'
        cols, results = init_conn.ddl_db(db_conn, select_sql)
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 2.7 search created event
@app.route('/user/search_create_event', methods=['GET'])
@login_required
def search_event_create():
    if request.method == 'GET':
        CreatorId = request.args.get('user_id', '')
        select_sql = f'SELECT * FROM PublicActivity where CreatorId = {CreatorId}'
        cols, results = init_conn.ddl_db(db_conn, select_sql)
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 2.8 Create Group
# FRONT END: here plz do not print in null value for group name / password based on db rules
@app.route('/user/create_group', methods=['POST'])
@login_required
def create_group():
    if request.method == 'POST':
        # inputs get by json
        GroupName, Passwd = request.json['group_name'], request.json['password']

        # db insert, both table(group, group attend)
        # unique name
        select_place = f'select GroupName from PrivateGroup where GroupName = "{GroupName}"'
        cols, results = init_conn.ddl_db(db_conn, select_place)
        if results.__len__() > 0:
            return jsonify({"code": 500,
                            "status": f"group existed."})

        insert_group = f'INSERT INTO PrivateGroup(GroupName,Passwd) \
                         VALUES ("{GroupName}","{Passwd}")'
        init_conn.ddl_db_uid(db_conn, insert_group)
        # return group_id
        select_id = f'select GroupId from PrivateGroup where GroupName = "{GroupName}"'
        cols, results = init_conn.ddl_db(db_conn, select_id)

        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 2.9 join group
@app.route('/user/join_group', methods=['POST'])
@login_required
def join_group():
    if request.method == 'POST':
        # inputs get by json
        GroupId, UserId, Passwd = request.json['group_id'], request.json['user_id'], request.json['password']
        # db insert, both table(group, group attend)
        # unique name
        select_place = f'select GroupId, Passwd from PrivateGroup where GroupId = {GroupId}'
        cols, results = init_conn.ddl_db(db_conn, select_place)
        # success
        if results.__len__() > 0 and (GroupId, Passwd) == results[0]:
            insert_group = f'INSERT INTO GroupJoin(GroupId,UserId) \
                             VALUES ({GroupId},{UserId})'
            try:
                init_conn.ddl_db_uid(db_conn, insert_group)
                ans = {
                    "code": 200
                }
            except Exception as e:
                ans = {
                    "code": 500,
                    "status": "user already joined"
                }
        else:
            msg = 'ERROR: unknown'
            if results.__len__() == 0 or GroupId != results[0][0]:
                msg = 'ERROR: no such group'
            elif Passwd != results[0][1]:
                msg = 'ERROR: wrong password'
            ans = {
                "code": 500,
                "status": msg
            }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


"""
part 3: public activity memo function
"""


# 3.1 create event(add location info also)
@app.route('/pa/create', methods=['POST'])
@login_required
def create_event():
    if request.method == 'POST':
        # inputs get by json
        EventName, EventType, StartDate, EndDate, CreatorId, Fee, Location, ZipCode = request.json['event_name'], \
                                                                                      request.json['event_type'], \
                                                                                      request.json['start_date'], \
                                                                                      request.json['end_date'], \
                                                                                      request.json['creator_id'], \
                                                                                      request.json['fee'], request.json[
                                                                                          'location'], request.json[
                                                                                          'zipcode']
        # set placeid
        PlaceId = int(datetime.timestamp(datetime.now()))
        # db insert, both table
        # if not existed, add new one
        select_place = f'select PlaceId from Place where Location = "{Location}"'
        cols, results = init_conn.ddl_db(db_conn, select_place)
        if results.__len__() > 0:
            PlaceId = results[0][0]
            # print(PlaceId)
            rsl1 = 1
        else:
            insert_place = f'insert into Place(PlaceId,Location, ZipCode) \
                                VALUES ({PlaceId},"{Location}", {ZipCode})'
            rsl1 = init_conn.ddl_db_uid(db_conn, insert_place)

        insert_event = f'insert into PublicActivity(EventName, EventType, StartDate, EndDate, CreatorId, Fee,PlaceId) \
                        VALUES ("{EventName}", "{EventType}", "{StartDate}", "{EndDate}", {CreatorId}, {Fee},{PlaceId})'
        rsl2 = init_conn.ddl_db_uid(db_conn, insert_event)
        if rsl1 and rsl2:
            return jsonify({
                "code": 200
            })
        else:
            return jsonify({"code": 500,
                            "status": f"create failed."})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})

    # response


# 3.2 join event(transaction)
@app.route('/pa/join', methods=['POST'])
@login_required
def join_event():
    if request.method == 'POST':
        # inputs get by json
        UserId, EventId = request.json['user_id'], request.json['event_id']

        # potential condition：if current time > end date then cannot join event
        select_enddate = f'select EndDate from PublicActivity where EventId = "{EventId}"'
        cols, results = init_conn.ddl_db(db_conn, select_enddate)
        if datetime.now() > results[0][0]:
            return jsonify({"code": 500,
                            "status": f"join failed. Event Expired."})

        # db insert(activityjoin + 1)
        insert_act = f'INSERT INTO ActivityJoin(EventId, UserId) \
                        VALUES ({EventId},"{UserId}")'
        try:
            rsl1 = init_conn.ddl_db_uid(db_conn, insert_act)
            # db update(visited time for place id + 1)
            update_place = f'UPDATE Place SET TimeVisit = TimeVisit + 1 \
                             WHERE PlaceId in (select PlaceId from PublicActivity where EventId = "{EventId}")'
            rsl2 = init_conn.ddl_db_uid(db_conn, update_place)
            # *db insert(no transaction here)

            # response
            return jsonify({
                    "code": 200
                })
        except Exception as e:
            return jsonify({"code": 500,
                            "status": "join failed."})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 3.3 delete event(creator权限)
@app.route('/pa/delete_create', methods=['POST'])
@login_required
def delete_create_event():
    if request.method == 'POST':

        # inputs get by json
        EventId, CreatorId = request.json['event_id'], request.json['user_id']
        # db check and delete
        select_act = f'SELECT EventId from PublicActivity where CreatorId = {CreatorId} and EventId = {EventId}'
        cols, results = init_conn.ddl_db(db_conn, select_act)
        # print(cols,count)
        if len(results) > 0:
            # f'DELETE FROM GroupJoin WHERE UserId = {user_id} AND GroupId = {group_id}'
            delete_act = f'DELETE FROM PublicActivity \
                        WHERE EventId = {EventId}'
            rsl = init_conn.ddl_db_uid(db_conn, delete_act)
            # response
            if rsl:
                return jsonify({
                    "code": 200
                })

        return jsonify({"code": 500,
                        "status": f"no authority.delete failed."})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 3.4 delete person from event(person)
@app.route('/pa/delete_join', methods=['POST'])
@login_required
def delete_join_event():
    if request.method == 'POST':
        # inputs get by json
        EventId, UserId = request.json['event_id'], request.json['user_id']

        # db delete
        delete_act = f'DELETE FROM ActivityJoin \
                        WHERE EventId = {EventId} and UserId = {UserId}'
        rsl = init_conn.ddl_db_uid(db_conn, delete_act)
        # response
        if rsl:
            return jsonify({
                "code": 200
            })
        else:
            return jsonify({"code": 500,
                            "status": f"delete failed."})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


# 3.7 search all event from dashboard
@app.route('/pa/search_all', methods=['GET'])
@login_required
def search_event_all():
    # eventid, event name, all info
    if request.method == 'GET':
        keyword = request.args.get('keyword', '')
        select_event = f'select * from PublicActivity where EventName like "%{keyword}%"'
        cols, results = init_conn.ddl_db(db_conn, select_event)
        list_rsl = cur_to_dict(cols, results)
        ans = {
            "code": 200,
            "data": list_rsl
        }
        return jsonify(ans)
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


if __name__ == '__main__':
    app.run(debug=True, port=8888, host='127.0.0.1')
