// Function to update the time dynamically in the footer
function updateTime() {
    const timeElement = document.getElementById("current-time");
    const now = new Date();

    // Format the current time
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    const formattedTime = now.toLocaleString('en-US', options);

    // Update the content of the time element
    timeElement.textContent = `Current Time: ${formattedTime}`;
}

// Run the updateTime function immediately
updateTime();

// Refresh the time every second
setInterval(updateTime, 1000);
