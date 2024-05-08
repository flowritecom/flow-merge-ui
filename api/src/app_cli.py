import sys

from src.cli.utils import build_arg_parser
from src.cli.migrations import MigrationsCommand
from dotenv import load_dotenv
from src.config import get_config
from src.db.db import Connection

load_dotenv(override=True)

app_config = get_config()
db = Connection(app_config.db_name)

migrations_cmd = MigrationsCommand(db, app_config)

cli_commands = {
    "migrate": {
        "help": "Handles database migrations",
        "commands": {
            "up": {
                "help": "applies migrations",
                "cmd": migrations_cmd.migrate_up,
                "args": {
                    "--number": {"help": f"when used (--number=1), applies that many migrations instead of all at once", "required": False}
                }
            },
            "down": {
                "help": "reverts migrations",
                "cmd": migrations_cmd.migrate_down,
                "args": {
                    "--number": {"help": f"when used (--number=1), reverts that many migrations instead of all at once", "required": False}
                }
            },
        }
    }
}

parser = build_arg_parser(
    cli_commands,
    prog='.venv/bin/python -m src.app_cli',
    description='A set of CLI tools for the application maintenance'
)

# There are no arguments at all, print help and exit immediately
if len(sys.argv) == 1:
    parser.print_help()
    sys.exit(1)

args = parser.parse_args()

# Call selected command and subcommand
cli_commands[args.command]["commands"][args.subcommand]["cmd"](args)
