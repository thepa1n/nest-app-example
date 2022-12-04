export enum ShellCommandsEnum {
  DATABASE_MIGRATIONS = 'npx typeorm migration:run',
  DATABASE_SEEDS = 'node ./node_modules/typeorm-seeding/dist/cli.js seed',
}
