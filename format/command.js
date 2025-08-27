import { execSync } from "child_process";
import patterns from "./patterns.js";

const formatAll = () => {
    try {
        execSync(`cd back && npx prettier --write "${patterns.back}"`, { stdio: "inherit" });
        execSync(`cd front && npx prettier --write "${patterns.front}"`, { stdio: "inherit" });
        execSync(`cd doc && npx prettier --write "${patterns.doc}"`, { stdio: "inherit" });
        execSync(`cd format && npx prettier --write "${patterns.format}"`, { stdio: "inherit" });
    } catch (err) {
        console.error("Format error :", err);
        process.exit(1);
    }
};

formatAll();
