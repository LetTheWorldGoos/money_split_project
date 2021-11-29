# -*- coding:utf-8 -*
import configparser
import logging

from werkzeug.security import generate_password_hash, check_password_hash  # md5
import pymysql
import pandas as pd
from hashlib import md5
from db_conn import mysql_conn

tablename = "User"
user_conn = mysql_conn()
conn = user_conn.start_conn()


class User(object):
    def __init__(self):
        self.username = ""
        self.email = ""
        self.password_hash = ""
        self.con = conn

    # def check_connect(self):
    #     try:
    #         self.con.ping()
    #     except:
    #         self.con = pymysql.connect(host, user, password, database, port)

    # 加密部分目前省略
    # def set_password(self, password):
    #     self.password_hash = md5(password.encode(encoding='UTF-8')).hexdigest()
    #     return md5(password.encode(encoding='UTF-8')).hexdigest()
    #

    def validate_password(self, password):
        # return md5(password.encode(encoding='UTF-8')).hexdigest() == self.password_hash
        return password == self.password_hash

    def check_user(self, username, col):
        sql_query = f"select {col} from {tablename}"

        df = pd.read_sql(sql_query, con=self.con)
        # self.con.close()
        # logging.warning(username in df['user_name'].values)
        return username in df[col].values

    def register(self, username, password, email):
        self.username = username
        # self.set_password(password)
        self.email = email
        sql = f"INSERT INTO {tablename} (Username, Passwd, Email) \
               VALUES ('{username}', '{password}', '{email}');"
        user_conn.ddl_db_uid(self.con, sql)
        # self.execute_sql(sql=sql)

    def login(self, username):
        self.username = username
        sql = f"select * from {tablename} where Username = '{username}';"
        conn.ping(reconnect=True)
        df = pd.read_sql(sql, con=self.con)
        if not df.empty:
            self.password_hash = df['Passwd'].values[0]

    def get_id(self, username):
        """
        run only when username is identified
        :return:
        """
        sql = f"select UserId from {tablename} where Username = '{username}';"
        conn.ping(reconnect=True)
        df = pd.read_sql(sql, con=self.con)
        if not df.empty:
            return df['UserId'].values[0]