document.addEventListener("DOMContentLoaded", async function () {

    const container =
        document.getElementById("applications-container");

    const studentId =
        localStorage.getItem("studentId");

    if (!studentId) {

        container.innerHTML =
            "<p>Please login first.</p>";

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/applications/student/"
            + studentId
        );

        if (!response.ok) {
            throw new Error("Failed to load applications");
        }

        const applications = await response.json();

        if (applications.length === 0) {

            container.innerHTML =
                "<p>You have not applied for any jobs yet.</p>";

            return;
        }

        container.innerHTML = "";

        applications.forEach(function (application) {

            const card = document.createElement("div");

            card.className = "application-card";

            card.innerHTML = `
                <h3>Job ID: ${application.jobId}</h3>

                <p>
                    <strong>Name:</strong>
                    ${application.name}
                </p>

                <p>
                    <strong>Applied Date:</strong>
                    ${new Date(application.appliedDate)
                        .toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong>
<span class="status-${application.status.toLowerCase()}">
    ${application.status}
</span>s
                </p>

                <p>
                    <strong>Resume:</strong>
                    <a href="http://localhost:8080/api/applications/${application.id}/resume"
                       target="_blank">
                        Download Resume
                    </a>
                </p>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load applications.</p>";
    }

});