import os
from flask import Flask, jsonify, render_template
from requests import session
import psycopg2
import sys
from sqlalchemy import create_engine
from config import pg_pass
from config import pg_user
import psycopg2


# create engine for postgresql
rds_connection_string = (f'{pg_user}:{pg_pass}@localhost:5432/Nobel_prize_db')
engine = create_engine(f'postgresql://{rds_connection_string}')

app= Flask(__name__)


def get_db_connection():
    conn = psycopg2.connect(host='localhost',
                            database='Nobel_prize_db',
                            user='pg_user',
                            password='pg_pass')
    return conn


@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM public.nobel1_prize;')
    nobelprizes = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('index1.html', nobelprizes=nobelprizes)

from flask import Flask, render_template, request, url_for, redirect

@app.route('/create/', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        awardYear = request.form['awardYear']
        category = request.form['category']
        motivation = int(request.form['motivation'])
        birth_country = request.form['birth_country']

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO books (title, author, pages_num, review)'
                    'VALUES (%s, %s, %s, %s)',
                    (awardYear, category, motivation, birth_country))
        conn.commit()
        cur.close()
        conn.close()
        return redirect(url_for('index'))

    return render_template('create.html')