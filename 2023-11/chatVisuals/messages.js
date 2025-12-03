const messages = $("#messages");
/** @type {JQuery<HTMLDivElement>} */
const wrapper = $(".messages-wrapper");

function clearMessages() {
    messages.empty();
}

var accountID = 1;

var randomFirstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Joe",
    "Mary",
    "James",
    "Sarah",
    "Michael",
    "David",
    "Jennifer",
    "Chris",
    "Mike",
    "Tom",
    "Mark",
    "Lisa",
    "Michelle",
    "Nicole",
    "Samantha",
    "Daniel",
    "Paul",
    "Jason"
];

var randomLastNames = [
    "Doe",
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark"
]


var randomAvatars = [
    "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=Gray02&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
    "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairTheCaesar&accessoriesType=Wayfarers&hairColor=Blonde&facialHairType=BeardMedium&facialHairColor=BrownDark&clotheType=Overall&clotheColor=Blue02&eyeType=Hearts&eyebrowType=UpDownNatural&mouthType=Tongue&skinColor=Pale",
    "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight2&accessoriesType=Prescription01&hairColor=Auburn&facialHairType=BeardMajestic&facialHairColor=Blonde&clotheType=ShirtScoopNeck&clotheColor=Blue01&eyeType=Hearts&eyebrowType=Default&mouthType=ScreamOpen&skinColor=Brown",
    "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairCurvy&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=BlondeGolden&clotheType=GraphicShirt&clotheColor=Blue02&graphicType=Skull&eyeType=Side&eyebrowType=UnibrowNatural&mouthType=Disbelief&skinColor=Pale",
    "https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=SilverGray&facialHairType=BeardMajestic&facialHairColor=BlondeGolden&clotheType=Overall&clotheColor=Gray01&graphicType=SkullOutline&eyeType=EyeRoll&eyebrowType=UpDown&mouthType=Smile&skinColor=Brown",
    "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairDreads01&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=Hoodie&clotheColor=PastelGreen&graphicType=Pizza&eyeType=Close&eyebrowType=UpDownNatural&mouthType=Smile&skinColor=Yellow"
];

var randomSenders = [];

for (var i = 0; i < randomAvatars.length; i++) {
    var rand1 = Math.floor(Math.random() * randomFirstNames.length);
    var rand2 = Math.floor(Math.random() * randomLastNames.length);

    randomSenders.push({
        "id": i + 1,
        "name": randomFirstNames[rand1] + " " + randomLastNames[rand2],
        "avatar": randomAvatars[i]
    });
}

var words = [
    "apple",
    "banana",
    "test",
    "hello",
    "world",
    "javascript",
    "jquery",
    "maybe",
    "yes",
    "no",
    "perhaps",
    "orange",
    "ordinary",
    "extraordinary",
    "extra",
    "information",
    "power",
    "wealth",
    "rich",
    "poor",
    "weak"
];

var randomImages = [
    "images/avatar.jpg",
    "images/avatar.png",
    "images/profile.webp",
    "images/sunset.jpg",
    "images/transparent.png"
]

function generateRandomMessage() {
    var content = "";

    for (var i = 0; i < Math.floor(Math.random() * 100) + 1; i++) {
        content += words[Math.floor(Math.random() * words.length)] + " ";
    }

    content = content.trim();

    var addImages = Math.floor(Math.random() * 2) === 0;
    var images = [];

    if (addImages) {
        var randomImageCount = Math.floor(Math.random() * 7) + 1;
        for (var i = 0; i < randomImageCount; i++) {
            images.push(randomImages[Math.floor(Math.random() * randomImages.length)]);
        }
    }

    return {
        "sender": randomSenders[Math.floor(Math.random() * randomSenders.length)],
        "content": content,
        "images": images
    };
}

var lastMessageSenderId = null;

function addMessage(message) {
    // replace all html tags with their escaped versions
    message.content = message.content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    var isAtBottom = wrapper.scrollTop() + wrapper.innerHeight() >= wrapper[0].scrollHeight;

    let messageElement = $(`
    <div class="message-wrapper ${message.sender.id === accountID ? 'self' : ''} ${lastMessageSenderId === message.sender.id ? 'joined' : ''}">
        <div class="message">
            <div class="message-left">
                <div class="message-avatar-wrapper">
                    <img class="message-avatar" ondragstart="return false;" src="${message.sender.avatar}">
                    <img class="message-avatar-background" ondragstart="return false;" src="${message.sender.avatar}">
                </div>
            </div>

            <div class="message-right">
                <div class="message-sender">${message.sender.name}</div>

                <div class="message-content">
                    ${message.content}
                </div>

                <div class="message-images">
                    ${message.images.map(image => `<img class="message-image" ondragstart="return false;" src="${image}">`).join("")}
                </div>
            </div>
        </div>
    </div>
    `);

    messages.append(messageElement);
    lastMessageSenderId = message.sender.id;

    if (isAtBottom === true) {
        wrapper.scrollTop(wrapper[0].scrollHeight);
    }
}

function addMessages(messages) {
    messages.forEach(message => addMessage(message));
}

function generateRandomMessages(count) {
    var messages = [];

    for (var i = 0; i < count; i++) {
        messages.push(generateRandomMessage());
    }

    return messages;
}

function createRandomMessages() {
    generateRandomMessages(1).forEach(message => addMessage(message));
}

clearMessages();
createRandomMessages();

wrapper.on("scroll", () => {
    if (wrapper.scrollTop() + wrapper.innerHeight() >= wrapper[0].scrollHeight) {
        wrapper.removeClass("scrolled");
        wrapper.stop(true, false);
    } else {
        wrapper.addClass("scrolled");
    }
});

$("#messages-scroll-btn").on("click", () => {
    // wrapper.scrollTop(wrapper[0].scrollHeight);
    wrapper.animate({
        scrollTop: wrapper[0].scrollHeight - wrapper.innerHeight()
    }, 500, "easeOutCubic");
});

// on mouse wheel move, cancel the animation
wrapper.on("wheel", () => {
    wrapper.stop(true, false);
});


$(document).on("keydown", () => {
    if (event.key === 'k') {
        event.preventDefault();
        createRandomMessages();
    } else if (event.key === 'c') {
        event.preventDefault();
        clearMessages();
    }
});
