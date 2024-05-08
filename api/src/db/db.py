import sqlite3
from typing import Tuple, Any


class Connection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.conn = None

    def connect(self) -> None:
        self.conn = sqlite3.connect(self.db_name)

    def disconnect(self) -> None:
        if self.conn:
            self.conn.close()

    def execute(self, query: str, params: Tuple = None) -> None:
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        self.conn.commit()
        cursor.close()

    def query(self, query: str, params: Tuple = None) -> list[Any] | None:
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        return rows
