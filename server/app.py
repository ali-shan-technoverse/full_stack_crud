import datetime

import pymysql
from flask import Flask, request, jsonify, session, g
from flask_cors import CORS, cross_origin
import random, string

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
CORS(app)


class DataBase:
    def __init__(self):
        self.connection = pymysql.connect(host='localhost',
                                          user='root',
                                          password='',
                                          database='user_crud',
                                          charset='utf8mb4',
                                          cursorclass=pymysql.cursors.DictCursor)
        self.cursor = self.connection.cursor()

    def readCompleteTable(self, input, table):
        self.cursor.execute(f'SELECT {input} FROM {table}')
        self.cursor.connection.commit()
        output = self.cursor.fetchall()
        return output

    def readSpecificItem(self, items, table, condition):
        self.cursor.execute(f'SELECT {items} FROM {table} WHERE {condition} ORDER BY `_login_time` DESC LIMIT 1')
        output = self.cursor.fetchone()
        return output

    def deleteSpecificItem(self, table, condition):
        self.cursor.execute(f'DELETE FROM {table} WHERE {condition}')
        self.cursor.connection.commit()
        return 'Done'

    def updateSpecificItem(self, table, setClause, condition):
        self.cursor.execute(f'UPDATE {table} SET {setClause} WHERE {condition}')
        self.cursor.connection.commit()
        return 'Done'

    def AddItem(self, table, columns, values):
        self.cursor.execute(f'INSERT INTO {table} {columns} VALUES {values}')
        self.cursor.connection.commit()
        return 'Done'

    def get_user_by_username(self, username):
        self.cursor.execute(f"SELECT * FROM user_tbl WHERE _username = '{username}'")
        user_data = self.cursor.fetchone()
        return user_data

    def __del__(self):
        self.cursor.close()
        self.connection.close()


@app.route('/login', methods=['POST'])
def login():
    db = DataBase()

    if request.method == 'POST':
        parsed_json = request.get_json()
        user_name = parsed_json["_username"]
        password = parsed_json["_password"]
        user_session_token = parsed_json["_session_token"]

        user_data = db.get_user_by_username(user_name)
        userid = user_data["UID"]
        user_session_data = db.readSpecificItem('*', 'session_tbl', f'UID = {userid}')
        print(user_session_data)

        # checking if user is valid
        if user_data and user_data["_password"] == password:
            # checking if the session is present
            # checking if the user is login if not make new session
            # checking if the user has the session token or not
            if user_session_data and user_session_data['_active'] and user_session_token:
                print(user_session_data)
                return jsonify(message="User Already Logged In"), 200
            else:
                _new_token = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
                # addNewSession
                columns = f"(`UID`, `_token`, `_login_time`, `_active`)"
                values = f"({userid}, '{_new_token}', '{datetime.datetime.now()}', '{1}')"
                db.AddItem('session_tbl', columns, values)
                print(_new_token)
            return jsonify(message="Login successful", token=_new_token), 200
        else:
            return jsonify(message="Invalid credentials"), 401


@app.route("/logout", methods=["POST"])
def User_Logout():
    db = DataBase()

    if request.method == 'POST':
        parsed_json = request.get_json()
        user_session_token = parsed_json['_session_token']

        set_clause = f"`_logout_time` = '{datetime.datetime.now()}', `_active` = '{0}'"
        db.updateSpecificItem('session_tbl', set_clause, f'_token = {user_session_token}')
        print('user logged out')
    return jsonify("logout successful"), 200


@app.route('/users', methods=['GET'])
def get_users():
    db = DataBase()

    # if request.methods == 'GET':
    users_data = db.readCompleteTable('*', 'user_tbl')
    return jsonify(users_data), 200


@app.route('/remove_user', methods=['POST'])
def remove_user():
    db = DataBase()

    if request.method == 'POST':
        parsedJson = request.get_json()
        user_id = parsedJson["UID"]
        result = db.deleteSpecificItem('user_tbl', f'UID = {user_id}')
        return jsonify(result), 200


@app.route('/update_user', methods=['POST'])
def update_user():
    db = DataBase()

    if request.method == 'POST':
        parsedJson = request.get_json()
        user_id = parsedJson["UID"]
        user_name = parsedJson["_username"]
        RID = parsedJson["RID"]
        password = parsedJson["_password"]
        set_clause = f"_username='{user_name}', _password='{password}', RID='{RID}'"
        print(set_clause)
        result = db.updateSpecificItem('user_tbl', set_clause, f'UID = {user_id}')
        return jsonify(result), 200


@app.route('/add_user', methods=['POST'])
def add_user():
    db = DataBase()

    if request.method == 'POST':
        parsedJson = request.get_json()
        user_name = parsedJson["_username"]
        RID = parsedJson["RID"]
        password = parsedJson["_password"]
        columns = f"(`_username`, `_password`, `RID`)"
        values = f"('{user_name}', '{password}', '{RID}')"
        result = db.AddItem('user_tbl', columns, values)
        return jsonify(result)


if __name__ == '__app__':
    app.run(debug=True)
