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
cur.execute('DROP TABLE IF EXISTS nobel1_prize;')
sql ='''CREATE TABLE nobel1_prize (awardyear INTEGER NOT NULL, 
                                  category VARCHAR(100) NOT NULL, 
                                  categoryfullname VARCHAR (100) NOT NULL, 
                                  sortorder VARCHAR(100) NOT NULL,
                                  prizeamount INTEGER NOT NULl,
                                  motivation VARCHAR (5000) NOT NULL ,
                                  award_link VARCHAR (100) NOT NULL,
                                  id INTEGER,
                                  name VARCHAR(100) NOT NULL,
                                  fullname VARCHAR(100),
                                  gender VARCHAR(30),
                                  laureate_link VARCHAR (100) NOT NULL, 
                                  birth_date VARCHAR (100),
                                  birth_cityNow VARCHAR (100),
                                  birth_continent VARCHAR (100),
                                  birth_countrynow VARCHAR (100),
                                  birth_locationstring VARCHAR (100) 
                                  );'''
cur.execute(sql)

# Insert data into the table
'''COPY nobel1_prize(awardyear,category,categoryfullname,sortorder,prizeamount,motivation,award_link,id,name,fullname,gender,laureate_link,birth_date,birth_citynow,birth_continent,birth_countrynow,birth_locationstring) 
FROM 'C:/Users/deeps/OneDrive/Desktop/project-3/nobel1_prize.csv'
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
