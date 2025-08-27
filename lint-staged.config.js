import patterns from "./format/patterns.js";

const buildRegex = (extensions) => new RegExp(`\\.(${extensions.join("|")})$`);

export default {
    "*": (filenames) => {
        const backFiles = filenames.filter(f => f.startsWith("back/") && buildRegex(patterns.back).test(f));
        const frontFiles = filenames.filter(f => f.startsWith("front/") && buildRegex(patterns.front).test(f));

        const commands = [];
        if (backFiles.length) commands.push(`npx prettier --write ${backFiles.join(" ")}`);
        if (frontFiles.length) commands.push(`npx prettier --write ${frontFiles.join(" ")}`);

        return commands;
    },
};
