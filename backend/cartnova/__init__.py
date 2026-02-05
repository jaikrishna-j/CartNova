# Use PyMySQL as MySQL driver (works on Windows without Visual C++ Build Tools)
# Same MySQL database - just a pure-Python driver instead of mysqlclient
import pymysql

pymysql.install_as_MySQLdb()
