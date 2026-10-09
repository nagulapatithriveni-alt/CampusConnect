let selectedJobId = null;


// ===============================
// JOB DATA
// ===============================

const jobs = {

    1: {
        title: "Java Developer",
        company: "ABC Technologies",
        location: "Chennai",
        salary: "₹5 - 8 LPA",
        skills: "Java, Spring Boot, SQL"
    },

    2: {
        title: "Frontend Developer",
        company: "Tech Solutions",
        location: "Bangalore",
        salary: "₹4 - 7 LPA",
        skills: "HTML, CSS, JavaScript"
    },

    3: {
        title: "Python Developer",
        company: "Digital Works",
        location: "Hyderabad",
        salary: "₹5 - 9 LPA",
        skills: "Python, Django, SQL"
    }

};


// ===============================
// SCROLL TO JOBS
// ===============================

function scrollToJobs() {

    document
        .getElementById("jobs")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// VIEW JOB
// ===============================

function viewJob(jobId) {

    selectedJobId = jobId;

    const job = jobs[jobId];

    document.getElementById("job-title").innerText =
        job.title;

    document.getElementById("job-company").innerText =
        "Company: " + job.company;

    document.getElementById("job-location").innerText =
        "Location: " + job.location;

    document.getElementById("job-salary").innerText =
        "Salary: " + job.salary;

    document.getElementById("job-skills").innerText =
        "Skills: " + job.skills;


    const details =
        document.getElementById("job-details");

    details.style.display = "block";


    details.scrollIntoView({
        behavior: "smooth"
    });

}


// ===============================
// SHOW APPLICATION FORM
// ===============================

function showApplicationForm() {

    if (!selectedJobId) {

        alert("Please select a job first.");

        return;
    }


    const studentId =
        localStorage.getItem("studentId");


    if (!studentId) {

        alert("Please login before applying.");

        window.location.href = "login.html";

        return;
    }


    const form =
        document.getElementById("application-form");


    form.style.display = "block";


    form.scrollIntoView({
        behavior: "smooth"
    });


    const name =
        localStorage.getItem("studentName");

    const email =
        localStorage.getItem("studentEmail");

    const phone =
        localStorage.getItem("studentPhone");


    if (name) {

        document.getElementById(
            "applicant-name"
        ).value = name;

    }


    if (email) {

        document.getElementById(
            "applicant-email"
        ).value = email;

    }


    if (phone) {

        document.getElementById(
            "applicant-phone"
        ).value = phone;

    }

}


// ===============================
// SUBMIT APPLICATION
// ===============================

async function submitApplication(event) {

    event.preventDefault();


    const studentId =
        localStorage.getItem("studentId");


    if (!studentId) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }


    if (!selectedJobId) {

        alert("Please select a job.");

        return;
    }


    const name =
        document.getElementById(
            "applicant-name"
        ).value;

    const email =
        document.getElementById(
            "applicant-email"
        ).value;

    const phone =
        document.getElementById(
            "applicant-phone"
        ).value;

    const resume =
        document.getElementById(
            "applicant-resume"
        ).files[0];


    if (!resume) {

        alert("Please select a resume.");

        return;
    }


    const formData = new FormData();

    formData.append(
        "studentId",
        studentId
    );

    formData.append(
        "jobId",
        selectedJobId
    );

    formData.append(
        "name",
        name
    );

    formData.append(
        "email",
        email
    );

    formData.append(
        "phone",
        phone
    );

    formData.append(
        "resume",
        resume
    );


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/applications",
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text || "Application failed"
            );
        }


        document.getElementById(
            "success-message"
        ).innerText =
            "Application submitted successfully!";


        document.querySelector(
            "#application-form form"
        ).reset();


    } catch (error) {

        console.error(
            "Application error:",
            error
        );


        document.getElementById(
            "success-message"
        ).innerText =
            "Failed to submit application.";

    }

}


// ===============================
// FILTER JOBS
// ===============================

function filterJobs() {

    const selected =
        document.getElementById(
            "jobFilter"
        ).value;


    const cards =
        document.querySelectorAll(
            ".job-card"
        );


    let visibleCount = 0;


    cards.forEach(function(card) {

        const type =
            card.dataset.jobType;


        if (
            selected === "all" ||
            selected === type
        ) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    document.getElementById(
        "no-jobs-message"
    ).style.display =
        visibleCount === 0
            ? "block"
            : "none";

}