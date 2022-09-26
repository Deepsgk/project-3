import os
import psycopg2

conn = psycopg2.connect(host='localhost',
                            database='Nobel_prize_db',
                            user='postgres',
                            password='4167')


# Open a cursor to perform database operations
conn.autocommit = True
cur = conn.cursor()

# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS country;')
sql ='''CREATE TABLE country (id INTEGER,
    firstname VARCHAR (100) ,
    surname VARCHAR (100) ,
    borncountry VARCHAR (100) ,
    borncountry_code VARCHAR (1000) ,
    born_city VARCHAR (100) ,
    gender VARCHAR (100),
    year  INTEGER,
    category VARCHAR (100),
    motivation VARCHAR (1000) ,
    organization_name VARCHAR (1000) ,
    organization_city VARCHAR (1000) ,
    organization_country VARCHAR (100) ,
    latitude FLOAT,
    longitude FLOAT
);'''
cur.execute(sql)

# Insert data into the table
'''COPY COUNTRY(id, firstname, surname, borncountry, borncountry_code, borncity, gender, year, category, motivation, organization_name, organization_city, organization country, latitude , longitude ) 
FROM '/project-3/nobelprizecoordinates.csv'
DELIMITER ','
CSV HEADER
ENCODING 'UTF8';'''

sql2 = '''select * from nobel1_prize;'''
cur.execute(sql2)
for i in cur.fetchall():
    print(i)
  
conn.commit()
cur.close()
conn.close()