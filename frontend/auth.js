async function loginStudent(event) {

    event.preventDefault();

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value;

    const message =
        document.getElementById("login-message");

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error("Login failed");
        }

        // Save logged-in student
        localStorage.setItem(
            "studentId",
            result.id
        );

        localStorage.setItem(
            "studentName",
            result.name
        );

        localStorage.setItem(
            "studentEmail",
            result.email
        );

        localStorage.setItem(
            "studentPhone",
            result.phone
        );

        message.innerText =
            "Login successful!";

        // Go to student home
        window.location.href = "index.html";

    } catch (error) {

        console.error(error);

        message.innerText =
            "Invalid email or password.";

    }
}
