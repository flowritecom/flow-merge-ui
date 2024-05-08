import importlib
import importlib.util
import os
import time

from src.config import ApplicationConfig

from src.db.db import Connection


class MigrationsCommand:
    db: Connection = None
    app_config: ApplicationConfig

    def __init__(
            self,
            db: Connection,
            app_config: ApplicationConfig,
    ):
        self.app_config = app_config
        self.db = db

    def migrate_up(self, args=None):
        self._ensure_init_db()

        migrated = self.db.query("SELECT name FROM migrations")
        migrated = [m[0] for m in migrated]

        available_migrations = os.listdir("src/db/migrations/")
        available_migrations = [m for m in available_migrations if m.startswith("m") and m.endswith(".py")]

        to_apply = list(set(available_migrations) - set(migrated))
        to_apply.sort()

        try:
            no_to_apply = int(args.number)
        except TypeError:
            no_to_apply = -1

        if no_to_apply > -1:
            to_apply = to_apply[:no_to_apply]

        if len(to_apply) == 0 or no_to_apply == 0:
            print("No migrations to apply")
            return

        for migration_name in to_apply:
            migration = self._load_migration(migration_name)
            print(f"Migrating {migration_name}...")
            migration.up(self.db)
            self.db.execute("INSERT INTO migrations VALUES(?, ?)", (migration_name, time.time()))
            print("Done")

    def migrate_down(self, args):
        self._ensure_init_db()
        try:
            no_to_revert = int(args.number)
        except TypeError:
            no_to_revert = 1

        to_revert = self.db.query("SELECT name FROM migrations ORDER BY migrated_at DESC LIMIT ?", (no_to_revert,))
        to_revert = [n[0] for n in to_revert]

        for name in to_revert:
            migration = self._load_migration(name)
            print(f"Reverting {name}...")
            migration.down(self.db)
            print("Done")

    def _ensure_init_db(self):
        res = self.db.query("SELECT * FROM sqlite_master WHERE type='table' AND name='migrations'")
        if len(res) == 0:
            self.db.execute("CREATE TABLE migrations (name TEXT PRIMARY KEY, migrated_at INT)")

    def _load_migration(self, name: str):
        spec = importlib.util.spec_from_file_location("src.db.migrations", "src/db/migrations/" + name)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module
