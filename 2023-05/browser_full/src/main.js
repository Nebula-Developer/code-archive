const tabs = document.getElementById('tabs');

function createTab(tab, id) {
    const tabElement = document.createElement('div');
    tabElement.classList.add('tab');

    const tabFavicon = document.createElement('img');
    tabFavicon.classList.add('tab-favicon');
    tabFavicon.src = 'https://www.google.com/favicon.ico';
  
    const tabTitle = document.createElement('div');
    tabTitle.classList.add('tab-title');
    tabTitle.innerText = tab.title;

    const tabClose = document.createElement('div');
    tabClose.classList.add('tab-close', 'flex-center');
    console.log(tabClose.classList)
    
    const tabCloseIco = document.createElement('i');
    tabCloseIco.classList.add('fas', 'fa-times', 'hoverable');
    tabClose.appendChild(tabCloseIco);

    tabElement.appendChild(tabFavicon);
    tabElement.appendChild(tabTitle);
    tabElement.appendChild(tabClose);

    return tabElement;
}

function addTab(tab) {
    const tabElement = createTab(tab);
    tabs.appendChild(tabElement);
}

function removeTab() {
    const tabElement = tabs.children[0];
    tabs.removeChild(tabElement);
}

document.onkeydown = (e) => {
    if (e.key === 't') {
        addTab({ title: 'Google' });
    } else if (e.key === 'w') {
        removeTab(0);
    }
};
