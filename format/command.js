import { execSync } from "child_process";
import files from "./prettier-files.js";

const formatAll = () => {
    try {
        execSync(`cd back && npx prettier --write "${files.back}"`, { stdio: "inherit" });
        execSync(`cd front && npx prettier --write "${files.front}"`, { stdio: "inherit" });
    } catch (err) {
        console.error("Format error :", err);
        process.exit(1);
    }
};

formatAll();
