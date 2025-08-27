import files from "./prettier-files.js";

const buildRegex = (exts) => new RegExp(`\\.(${exts.join("|")})$`);

export default {
    "*": (filenames) => {
        const backFiles = filenames.filter(f => f.startsWith("back/") && buildRegex(files.back).test(f));
        const frontFiles = filenames.filter(f => f.startsWith("front/") && buildRegex(files.front).test(f));

        const commands = [];
        if (backFiles.length) commands.push(`npx prettier --write ${backFiles.join(" ")}`);
        if (frontFiles.length) commands.push(`npx prettier --write ${frontFiles.join(" ")}`);

        return commands;
    },
};
