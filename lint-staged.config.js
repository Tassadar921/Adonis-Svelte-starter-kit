import patterns from "./format/patterns.js";
import micromatch from "micromatch";

export default {
    "*": (filenames) => {
        console.log('ici : ', filenames)
        const commands = [];

        Object.keys(patterns).forEach((folder) => {
            const matchedFiles = micromatch(filenames, `${folder}/${patterns[folder]}`);
            console.log('là : ', matchedFiles)
            if (matchedFiles.length) {
                commands.push(`npx prettier --write ${matchedFiles.join(" ")}`);
            }
        });

        return commands;
    },
};
