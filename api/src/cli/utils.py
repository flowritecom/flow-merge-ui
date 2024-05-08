import sys
import argparse


def build_arg_parser(commands: dict, prog: str, description: str) -> argparse.ArgumentParser:
    class ParserWithDefaultHelp(argparse.ArgumentParser):
        def error(self, message):
            sys.stderr.write(f"error: {message}\n")
            self.print_help()
            sys.exit(2)

    parser = ParserWithDefaultHelp(prog=prog, description=description)

    subparsers = parser.add_subparsers(dest="command")

    create_commands(commands, subparsers)

    return parser


def create_commands(commands, subparsers):
    for i, (command, command_specs) in enumerate(commands.items()):
        command_parser = subparsers.add_parser(command, help=command_specs["help"])
        command_subparsers = command_parser.add_subparsers(dest="subcommand")
        command_subparsers.required = True

        _create_subcommands(command_specs, command_subparsers)


def _create_subcommands(command_specs, command_subparsers):
    for _, (subcommand, subcommand_specs) in enumerate(command_specs["commands"].items()):
        subcommand_parser = command_subparsers.add_parser(subcommand, help=subcommand_specs["help"])
        if "args" in subcommand_specs:
            _create_subcommand_args(subcommand_parser, subcommand_specs)


def _create_subcommand_args(subcommand_parser, subcommand_specs):
    for _, (arg, arg_specs) in enumerate(subcommand_specs["args"].items()):
        subcommand_parser.add_argument(
            arg,
            help=arg_specs["help"],
            required=(arg_specs["required"] if "required" in arg_specs else False)
        )
