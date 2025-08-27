import patterns from "./format/patterns.js";
import micromatch from "micromatch";
import { relative } from "path";
import { cwd } from "process";

export default {
    "*": (filenames) => {
        console.log('ici : ', filenames)
        const commands = [];

        const relativeFiles = filenames.map(f => relative(cwd(), f));

        Object.keys(patterns).forEach((folder) => {
            const matchedFiles = micromatch(relativeFiles, `${folder}/${patterns[folder]}`);
            console.log('là : ', `${folder}/${patterns[folder]}`, matchedFiles)
            if (matchedFiles.length) {
                commands.push(`npx prettier --write ${matchedFiles.join(" ")}`);
            }
        });

        return commands;
    },
};
