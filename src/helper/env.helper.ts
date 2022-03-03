import * as allEnv from "../config/env.config";

// stop program if env is missing
export const checkEnv = () => {
  Object.entries(allEnv).forEach((element) => {
    const value = element[1];
    if (!value) {
      console.error(`Environment variable missing`);
      console.table(allEnv);
      process.exit(1);
    }
  });
};
