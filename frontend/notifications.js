document.addEventListener("DOMContentLoaded", async function () {

    const container =
        document.getElementById("notifications-container");

    const studentId =
        localStorage.getItem("studentId");

    if (!studentId) {

        container.innerHTML =
            "<p>Please login first.</p>";

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/notifications/student/"
            + studentId
        );

        if (!response.ok) {
            throw new Error("Failed to load notifications");
        }

        const notifications = await response.json();

        if (notifications.length === 0) {

            container.innerHTML =
                "<p>You have no notifications.</p>";

            return;
        }

        container.innerHTML = "";

        notifications.forEach(function (notification) {

            const card = document.createElement("div");

            card.className = "application-card";

            card.innerHTML = `
                <h3>🔔 Notification</h3>

                <p>
                    ${notification.message}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${new Date(notification.createdAt)
                        .toLocaleString()}
                </p>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load notifications.</p>";
    }

});
document.getElementById("clear-notifications")
    .addEventListener("click", async function () {

        const studentId =
            localStorage.getItem("studentId");

        if (!studentId) {
            alert("Please login first.");
            return;
        }

        const confirmed =
            confirm("Are you sure you want to clear all notifications?");

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/notifications/student/"
                + studentId,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to clear notifications");
            }

            document.getElementById("notifications-container").innerHTML =
                "<p>You have no notifications.</p>";

        } catch (error) {

            console.error(error);

            alert("Unable to clear notifications.");

        }

    });