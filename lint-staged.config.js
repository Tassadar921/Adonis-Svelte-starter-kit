import patterns from "./format/patterns.js";

const buildRegex = (glob) => {
    const match = glob.match(/\*\.\{(.+)\}/) || glob.match(/\*\.(.+)/);
    const exts = match ? match[1].split(",") : [];
    return new RegExp(`\\.(${exts.join("|")})$`);
};

export default {
    "*": (filenames) => {
        console.log(filenames);
        const commands = [];

        // Parcours tous les dossiers/patterns définis dans patterns.js
        Object.keys(patterns).forEach((folder) => {
            const regex = buildRegex(patterns[folder]);
            const matchedFiles = filenames.filter(f => f.startsWith(`${folder}/`) && regex.test(f));

            console.log(matchedFiles)

            if (matchedFiles.length) {
                commands.push(`npx prettier --write ${matchedFiles.join(" ")}`);
            }
        });

        return commands;
    },
};
