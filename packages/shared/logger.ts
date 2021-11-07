import chalk from "chalk";

type loglevel = "info" | "success" | "error" | "debug";

/**
 * Pretty print console logs
 *
 * @param {string} log message
 * @param {loglevel} [level="debug"] "info" | "success" | "error" | "debug"
 */
const logger = (log: string, level: loglevel = "debug"): void => {
  const d = new Date();
  const t = d.toTimeString().split(" ")[0];
  switch (level) {
    case "error":
      console.log(t, chalk.black.bgRed("ERROR:"), log);
      break;

    case "info":
      console.log(t, chalk.black.bgYellow("INFO:"), log);
      break;

    case "success":
      console.log(t, chalk.black.bgGreen("SUCCESS:"), log);
      break;

    case "debug":
      if (process.env.PRODUCTION === "false")
        console.log(t, chalk.black.bgWhite("DEBUG:"), log);
      break;
  }
};

export { logger };
