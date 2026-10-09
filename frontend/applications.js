function getCurrentStudentId() {

    return localStorage.getItem("studentId");

}


function getJobTitle(jobId) {

    jobId = Number(jobId);


    if (jobId === 1) {
        return "Java Developer";
    }

    if (jobId === 2) {
        return "Frontend Developer";
    }

    if (jobId === 3) {
        return "Python Developer";
    }

    return "Unknown Job";

}


// ===============================
// LOAD MY APPLICATIONS
// ===============================

async function loadMyApplications() {

    const applicationsList =
        document.getElementById(
            "applications-list"
        );


    const studentId =
        getCurrentStudentId();


    if (!studentId) {

        applicationsList.innerHTML = `
            <p>
                Please login first.
            </p>
        `;

        return;
    }


    applicationsList.innerHTML =
        "<p>Loading applications...</p>";


    try {

        const response =
            await fetch(
                `http://localhost:8080/api/applications/student/${studentId}`
            );


        console.log(
            "Applications status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP error: " +
                response.status
            );

        }


        const applications =
            await response.json();


        console.log(
            "My applications:",
            applications
        );


        if (
            !applications ||
            applications.length === 0
        ) {

            applicationsList.innerHTML = `
                <p>
                    No applications found.
                </p>
            `;

            return;
        }


        applicationsList.innerHTML = "";


        applications.forEach(
            function(application) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "application-card";


                const status =
                    application.status || "Applied";


                card.innerHTML = `

                    <h3>
                        Application #${application.id}
                    </h3>

                    <p>
                        <strong>Job:</strong>
                        ${getJobTitle(application.jobId)}
                    </p>

                    <p>
                        <strong>Name:</strong>
                        ${application.name}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${application.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${application.phone}
                    </p>

                    <p>
                        <strong>Status:</strong>

                        <span class="
                            application-status
                            status-${status.toLowerCase()}
                        ">
                            ${status}
                        </span>

                    </p>

                    <p>
                        <strong>Applied:</strong>
                        ${
                            application.appliedDate
                            ? new Date(
                                application.appliedDate
                              ).toLocaleString()
                            : "N/A"
                        }
                    </p>

                    <p>
                        <strong>Resume:</strong>
                        ${application.resume || "N/A"}
                    </p>

                    <hr>

                `;


                applicationsList.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Applications error:",
            error
        );


        applicationsList.innerHTML = `

            <p class="error-message">

                Failed to load applications.

                <br><br>

                ${error.message}

            </p>

        `;

    }

}