function distanceString(date) {
    if (!date) {
        return "Invalid date";
    }

    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const diffSeconds = diff / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;

    const formatTime = (value, unit) => {
        const roundedValue = Math.floor(value);
        return roundedValue + " " + unit + (roundedValue === 1 ? "" : "s") + " ago";
    };

    if (diffSeconds < 60) {
        return formatTime(diffSeconds, "second");
    } else if (diffMinutes < 60) {
        return formatTime(diffMinutes, "minute");
    } else if (diffHours < 24) {
        return formatTime(diffHours, "hour");
    } else if (diffDays < 7) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[then.getDay()] + ", " + then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return then.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' }) + ", " + then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
