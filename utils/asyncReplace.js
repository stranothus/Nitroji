async function asyncReplace(string, regex, func) {
    const matched = string.match(regex);
    let replaces = await Promise.all(matched.map(async v => await func(v)));

    return string.replace(regex, () => {
        const r = replaces[0];

        replaces.shift();

        return r;
    });
}

export default asyncReplace;