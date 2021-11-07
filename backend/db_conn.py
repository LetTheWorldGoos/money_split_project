import pymysql


class mysql_conn:
    def __init__(self):
        # cannot connect with out GCP permission
        self.host = '34.135.32.110'
        self.user = 'root'
        self.passwd = '4laborindb'
        self.dbname = 'splitmunity'

    def start_conn(self):
        conn = pymysql.connect(self.host, self.user, self.passwd, self.dbname)
        return conn

    @staticmethod
    def ddl_db(conn, sql):
        """
        select function.
        :param conn: db connection
        :param sql:  sql query
        :return: data(separated by column names and data)
        """
        with conn.cursor() as cur:
            cur.execute(sql)
            # fetch title and data
            columns = [i[0] for i in cur.description]
            result = cur.fetchall()
            return columns, result
    @staticmethod
    def ddl_db_uid(conn, sql):
        """
        update/insert/delete function
        """
        with conn.cursor() as cur:
            cur.execute(sql)
            conn.commit()
            return True

    # def __del__(self, conn):
    #     conn.close()

# if __name__ == '__main__':
#     o = mysql_conn()
#     o.start_conn()
