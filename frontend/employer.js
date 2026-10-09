console.log(
    "EMPLOYER JS STARTED"
);


let allApplications = [];


// ===============================
// JOB TITLE
// ===============================

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
// LOAD APPLICATIONS
// ===============================

async function loadAllApplications() {

    console.log(
        "Loading applications..."
    );


    const container =
        document.getElementById(
            "employer-applications"
        );


    container.innerHTML =
        "<p>Loading applications...</p>";


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/applications"
            );


        console.log(
            "Response status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP error " +
                response.status
            );

        }


        allApplications =
            await response.json();


        console.log(
            "Applications:",
            allApplications
        );


        displayApplications(
            allApplications
        );


    } catch (error) {

        console.error(
            "ERROR:",
            error
        );


        container.innerHTML = `

            <div class="application-card">

                <h2>
                    Failed to load applications
                </h2>

                <p>
                    ${error.message}
                </p>

                <p>
                    Check the browser console
                    for more information.
                </p>

            </div>

        `;

    }

}


// ===============================
// DISPLAY APPLICATIONS
// ===============================

function displayApplications(
    applications
) {

    const container =
        document.getElementById(
            "employer-applications"
        );


    const count =
        document.getElementById(
            "application-count"
        );


    count.innerText =
        "Applications: " +
        applications.length;


    if (
        applications.length === 0
    ) {

        container.innerHTML = `

            <div class="application-card">

                <h2>
                    No applications found
                </h2>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    applications.forEach(
        function(application) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "application-card";


            card.innerHTML = `

                <h2>
                    Application #${application.id}
                </h2>

                <p>
                    <strong>Job:</strong>
                    ${getJobTitle(
                        application.jobId
                    )}
                </p>

                <p>
                    <strong>Job ID:</strong>
                    ${application.jobId}
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
                        status-${(
                            application.status || "Applied"
                        ).toLowerCase()}
                    ">
                        ${application.status}
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

                <div class="resume-buttons">

                    <button
                        type="button"
                        onclick="
                            viewResume(
                                ${application.id}
                            )
                        "
                    >
                        View Resume
                    </button>

                    <button
                        type="button"
                        onclick="
                            downloadResume(
                                ${application.id}
                            )
                        "
                    >
                        Download Resume
                    </button>

                </div>


                <br>


                <button
                    onclick="
                        updateStatus(
                            ${application.id},
                            'Shortlisted'
                        )
                    "
                >
                    Shortlist
                </button>


                <button
                    onclick="
                        updateStatus(
                            ${application.id},
                            'Selected'
                        )
                    "
                >
                    Select
                </button>


                <button
                    onclick="
                        updateStatus(
                            ${application.id},
                            'Rejected'
                        )
                    "
                >
                    Reject
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ===============================
// FILTER
// ===============================

function filterApplications() {

    const job =
        document.getElementById(
            "job-filter"
        ).value;


    const status =
        document.getElementById(
            "status-filter"
        ).value;


    const filtered =
        allApplications.filter(
            function(application) {

                const jobMatches =
                    job === "all" ||
                    Number(
                        application.jobId
                    ) === Number(job);


                const statusMatches =
                    status === "all" ||
                    application.status ===
                    status;


                return (
                    jobMatches &&
                    statusMatches
                );

            }
        );


    displayApplications(
        filtered
    );

}


// ===============================
// UPDATE STATUS
// ===============================

async function updateStatus(
    applicationId,
    status
) {

    try {

        const response =
            await fetch(

                `http://localhost:8080/api/applications/${applicationId}/status?status=${encodeURIComponent(status)}`,

                {
                    method: "PUT"
                }

            );


        if (!response.ok) {

            throw new Error(
                "Status update failed"
            );

        }


        alert(
            "Application updated to " +
            status
        );


        await loadAllApplications();


        filterApplications();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Failed to update status"
        );

    }

}


// ===============================
// VIEW RESUME
// ===============================

function viewResume(applicationId) {

    const url =
        `http://localhost:8080/api/applications/${applicationId}/resume`;


    window.open(
        url,
        "_blank"
    );

}


// ===============================
// DOWNLOAD RESUME
// ===============================

function downloadResume(applicationId) {

    const url =
        `http://localhost:8080/api/applications/${applicationId}/resume`;


    const link =
        document.createElement("a");


    link.href = url;

    link.download = "";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );

}


// ===============================
// PAGE START
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        document
            .getElementById(
                "load-button"
            )
            .addEventListener(
                "click",
                loadAllApplications
            );


        document
            .getElementById(
                "job-filter"
            )
            .addEventListener(
                "change",
                filterApplications
            );


        document
            .getElementById(
                "status-filter"
            )
            .addEventListener(
                "change",
                filterApplications
            );

    }
);
// ===============================
// JOB MANAGEMENT
// ===============================

async function loadJobs() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/jobs"
        );

        if (!response.ok) {
            throw new Error("Failed to load jobs");
        }

        const jobs = await response.json();

        const container =
            document.getElementById("jobs-container");

        container.innerHTML = "";

        jobs.forEach(function (job) {

            const card =
                document.createElement("div");

            card.className = "application-card";

            card.innerHTML = `
    <h3>${job.title}</h3>

    <p>
        <strong>Company:</strong>
        ${job.company}
    </p>

    <p>
        <strong>Location:</strong>
        ${job.location}
    </p>

    <p>
        <strong>Salary:</strong>
        ${job.salary}
    </p>

    <p>
        <strong>Skills:</strong>
        ${job.skills}
    </p>

    <p>
        <strong>Description:</strong>
        ${job.description}
    </p>

    <button onclick="deleteJob(${job.id})">
        Delete Job
    </button>
`;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        document.getElementById("jobs-container").innerHTML =
            "<p>Unable to load jobs.</p>";
    }
}


document.addEventListener("DOMContentLoaded", function () {

    loadJobs();

});
document.getElementById("add-job-button")
    .addEventListener("click", async function () {

        const job = {

            title: document.getElementById("job-title").value,

            company: document.getElementById("job-company").value,

            location: document.getElementById("job-location").value,

            salary: document.getElementById("job-salary").value,

            skills: document.getElementById("job-skills").value,

            description:
                document.getElementById("job-description").value
        };

        if (!job.title ||
            !job.company ||
            !job.location ||
            !job.salary) {

            alert("Please fill all required fields.");

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/jobs",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(job)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add job");
            }

            alert("Job added successfully!");

            document.getElementById("job-title").value = "";
            document.getElementById("job-company").value = "";
            document.getElementById("job-location").value = "";
            document.getElementById("job-salary").value = "";
            document.getElementById("job-skills").value = "";
            document.getElementById("job-description").value = "";

            loadJobs();

        } catch (error) {

            console.error(error);

            alert("Unable to add job.");
        }

    });