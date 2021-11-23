# -*- coding:utf-8 -*

# import logging
# from logging.handlers import RotatingFileHandler
from datetime import timedelta
import functools
from flask import Flask, render_template, request, redirect, session, g, flash, url_for, jsonify
from flask_cors import CORS
from user import User
from db_conn import mysql_conn
from utils import *

app = Flask(__name__)
# 跨域请求
CORS(app, supports_credentials=True)  # 设置跨域
app.config['JSON_AS_ASCII'] = False
# session管理在线时间最长2小时
app.secret_key = 'huangpu12345sk'
app.permanent_session_lifetime = timedelta(hours=1)
app.debug = True
init_conn = mysql_conn()
db_conn = init_conn.start_conn()

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


@app.route('/')
def index():
    return 'redirect to the page here(for user not login)'


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        # username & email are unique
        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        if not username or not password or not email:
            return jsonify({"code": 403, "status": "invalid input"})
        user_rg = User()

        if user_rg.check_user(username, 'Username') or user_rg.check_user(email, 'Email'):
            return jsonify({"code": 403, "status": "user already exist."})

        else:
            user_rg.register(username=username, password=password, email=email)
            return jsonify({"code": 200,
                            "status": "success"})
    else:
        return jsonify({
            "code": 501,
            "status": f"method{request.method} not supported"})


@app.route('/login', methods=['POST'])
def login():
    # session.permanent = True
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        if not username or not password:
            # flash('Invalid input.')
            return jsonify({"code": 501,
                            "status": "invalid input"})
        user_login = User()
        user_login.login(username)
        if user_login.validate_password(password):
            session['username'] = username

            print(session)

            return jsonify(
                {"code": 200,
                 "status": "success",
                 # "login": 1,
                 "username": user_login.username})
        else:
            return jsonify({"code": 401,
                            # "login": 1,
                            "status": "username or password not valid"})
    # return  render_template('[absolute_path]\login.html')
    else:
        return jsonify({
            "code": 500,
            "status": f"method{request.method} not supported"})


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    # remove the username from the session if it's there
    if session.get('username'):
        session.clear()
        return jsonify({"code": 200,
                        "status": "success"})
    else:
        return jsonify({"code": 501,
                        "status": "user not login"})


@app.route('/get_info', methods=['GET'])
@login_required
# 0.0 Userinfo
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
                            "status": f"cannot find use id {user}"})
    else:
        return jsonify({"code": 500,
                        "status": f"method{request.method} not supported"})


if __name__ == '__main__':
    app.run(debug=True, port=8002, host='localhost')
