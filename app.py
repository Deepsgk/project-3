import pandas as pd
from flask import Flask, jsonify, render_template, request, url_for, redirect
from requests import session
import psycopg2
import sys
from sqlalchemy import create_engine
from config import pg_pass
from config import pg_user
import psycopg2
from flask_cors import CORS, cross_origin
from flask import Response
import json
import plotly.express as px
import plotly

# create engine for postgresql
rds_connection_string = (f'{pg_user}:{pg_pass}@localhost:5432/Nobel_prize_db')
engine = create_engine(f'postgresql://{rds_connection_string}')

app= Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def get_db_connection():
    conn = psycopg2.connect(host='localhost',
                            database='Nobel_prize_db',
                            user='postgres',
                            password='4167')
    return conn

 
@app.route("/")
@cross_origin()
def homepage():
    return (
        f"Welcome to NOBELPRIZE API <br/>"
        f"Available Routes:<br/>"
        f"/api/v0/nobelprizewinners<br/>"
        f"/api.nobelprize.org/v1<br/>"
        f"/api/v0/country<br/>"
    

    )


@app.route("/api/v0/nobelprizewinners")
def nobelprizewinners():
    conn = get_db_connection()
    nobelprizewinners = pd.read_sql("SELECT * FROM public.nobel1_prize", conn)
    print(type(nobelprizewinners))
    return Response (nobelprizewinners.to_json(orient="records"), mimetype='application/json')

@app.route("/api/v0/country")
def country():
    conn = get_db_connection()
    country = pd.read_sql("SELECT * FROM public.country", conn)
    print(type(country))
    
    return Response(country.to_json(orient="records"), mimetype='application/json')



    

if __name__ == '__main__':
    app.run(debug=True)

import numpy as py
import pandas as pd
import datetime as dt
import matplotlib.pyplot as plt

df= pd.read_json('http://127.0.0.1:5000/api/v0/nobelprizewinners')
yearly_prize = df.groupby("awardyear")['awardyear'].count().reset_index(name = 'Count')
fig = px.bar(yearly_prize, x = 'awardyear', y = 'Count')

 

category = df.groupby('category')['category'].count().reset_index(name='Count')
fig2 = px.bar(category, x ='category', y ='Count', color='category')


fig3 = px.histogram(df, x='prizeamount')


fig4 = px.scatter(df, x="prizeamount", y="awardyear", color="category",
           marginal_x="box", template="simple_white")


fig5= px.violin(df,y= "awardyear", x="gender",color="category", box=True)

with open('p_graph.html', 'a') as f:
    f.write(fig.to_html(full_html=False, include_plotlyjs='cdn'))
    f.write(fig2.to_html(full_html=False, include_plotlyjs='cdn'))
    f.write(fig3.to_html(full_html=False, include_plotlyjs='cdn'))
    f.write(fig4.to_html(full_html=False, include_plotlyjs='cdn'))
    f.write(fig5.to_html(full_html=False, include_plotlyjs='cdn'))

