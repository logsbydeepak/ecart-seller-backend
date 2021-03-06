import * as allEnv from "~/config/env.config";

// stop program if env is missing
const checkEnv = () => {
  Object.entries(allEnv).forEach((element) => {
    const value = element[1];
    if (!value) {
      console.log("Environment variable missing");
      console.table(allEnv);
      process.exit(1);
    }
  });
};

export default checkEnv;
