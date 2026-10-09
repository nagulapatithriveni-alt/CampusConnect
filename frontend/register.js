document
    .getElementById("register-form")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("register-name")
                .value
                .trim();

        const email =
            document.getElementById("register-email")
                .value
                .trim();

        const phone =
            document.getElementById("register-phone")
                .value
                .trim();

        const password =
            document.getElementById("register-password")
                .value;

        const message =
            document.getElementById("register-message");

        message.innerText =
            "Registering...";

        // Get existing students
        const students =
            JSON.parse(
                localStorage.getItem("students") || "[]"
            );

        // Check if email already exists
        const existingStudent =
            students.find(function (student) {

                return student.email === email;

            });

        if (existingStudent) {

            message.innerText =
                "Email already registered.";

            return;
        }

        // Create new student
        const newStudent = {

            id: Date.now(),

            name: name,

            email: email,

            phone: phone,

            password: password

        };

        // Add student
        students.push(newStudent);

        // Save students
        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        message.innerText =
            "Registration successful!";

        // Go to login
        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1000);

    });