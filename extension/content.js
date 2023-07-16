browser.tabs.create({ url: "https://github.com" }).then(() => {
    setTimeout(() => {
        eval('console.log("test")');
    }, 3000);
});
