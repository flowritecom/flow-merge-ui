from src.db.db import Connection


def up(db: Connection):
    db.execute("CREATE TABLE IF NOT EXISTS merges (merge_name TEXT, uuid TEXT, merge_date TEXT, output_dir_path TEXT, log_stream TEXT, merge_config TEXT)")


def down(db: Connection):
    db.execute("DROP TABLE merges")
