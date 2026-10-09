document.getElementById("login-form").addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    message.innerText = "Logging in...";

    try {

        const response = await fetch("http://localhost:8080/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        const contentType = response.headers.get("content-type");

        let data;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {

            message.innerText =
                typeof data === "string"
                    ? data
                    : data.message || "Invalid email or password.";

            return;
        }

        localStorage.setItem("studentId", data.id);
        localStorage.setItem("studentName", data.name);
        localStorage.setItem("studentEmail", data.email);
        localStorage.setItem("studentPhone", data.phone);

        message.innerText = "Login successful!";

        setTimeout(function () {
            window.location.href = "index.html";
        }, 500);

    } catch (error) {

        console.error("Login error:", error);

        message.innerText =
            "Unable to connect to server. Check that the backend is running.";

    }

});