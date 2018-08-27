import time as tm
import requests as rs
import schedule
def hourly():
    while True:
        rs.post('URL')
        tm.sleep(3600)
def daily():
    while True:
        rs.post('URL')
        tm.sleep(84600)
schedule.every().monday.at("1:00").do(rs.post('URL'))
schedule.every().tuesday.at("1:00").do(rs.post('URL'))
schedule.every().wednesday.at("1:00").do(rs.post('URL'))
schedule.every().thursday.at("1:00").do(rs.post('URL'))
schedule.every().friday.at("1:00").do(rs.post('URL'))
schedule.every().friday.at("22:00").do(rs.post('URL'))
schedule.every(1).hour.do(rs.post('PURL'))
while True:
    schedule.run_pending()
    tm.sleep(1)

