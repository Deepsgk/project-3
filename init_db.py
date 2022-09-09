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
sql ='''CREATE TABLE nobel1_prize (awardYear INTEGER NOT NULL, 
                                  category VARCHAR(100) NOT NULL, 
                                  categoryFullName VARCHAR (100) NOT NULL, 
                                  sortOrder VARCHAR(100) NOT NULL,
                                  prizeAmount INTEGER NOT NULl,
                                  motivation VARCHAR (5000) NOT NULL ,
                                  award_link VARCHAR (100) NOT NULL,
                                  id INTEGER,
                                  name VARCHAR(40) NOT NULL,
                                  fullName VARCHAR(100),
                                  gender VARCHAR(30),
                                  laureate_link VARCHAR (100) NOT NULL, 
                                  birth_date VARCHAR (100),
                                  birth_cityNow VARCHAR (40),
                                  birth_continent VARCHAR (40),
                                  birth_countryNow VARCHAR (40),
                                  birth_locationString VARCHAR (100) 
                                  );'''
cur.execute(sql)

# Insert data into the table
sql2 = '''COPY nobel1_prize (awardYear, 
                            category, 
                           categoryFullName, 
                            sortOrder,
                            prizeAmount,
                            motivation,
                            award_link,
                            id,
                            name,
                            fullName,
                            gender,
                            laureate_link,
                            birth_date,
                            birth_cityNow,
                            birth_continent,
                            birth_countryNow,
                            birth_locationString)
FROM 'complete_nobel.csv'
DELIMITER ','
CSV HEADER;'''
  
cur.execute(sql2)
  
sql3 = '''select * from nobel1_prize;'''
cur.execute(sql3)
for i in cur.fetchall():
    print(i)
  
conn.commit()
cur.close()
conn.close()