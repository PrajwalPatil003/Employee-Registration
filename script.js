
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("employeeForm");
    const table = document.getElementById("employeeTable");
    const message = document.getElementById("message");
    const highestSalary = document.getElementById("highestSalary");
    const employees = [];

    if (!form || !table) {
        alert("Check the employeeForm and employeeTable IDs in index.html.");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value.trim();
        const department = document.getElementById("department").value;
        const salaryText = document.getElementById("salary").value;
        const salary = Number(salaryText);
        const gender = document.getElementById("gender").value;

        const errors = {
            name: /^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name) ? "" : "Enter a valid name.",
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email.",
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/.test(password) ? "" : "Use 8+ characters, uppercase, lowercase, number and symbol.",
            phone: /^[6-9]\d{9}$/.test(phone) ? "" : "Enter a valid 10-digit Indian mobile number.",
            department: department ? "" : "Select a department.",
            salary: salaryText !== "" && Number.isFinite(salary) && salary > 0 ? "" : "Enter a valid salary.",
            gender: gender ? "" : "Select gender."
        };

        Object.entries(errors).forEach(([key, error]) => {
            document.getElementById(key + "Error").textContent = error;
        });

        message.textContent = "";
        message.className = "";

        if (Object.values(errors).some(error => error)) {
            message.textContent = "Please correct the errors above.";
            message.className = "failure";
            return;
        }

        if (employees.some(emp => emp.email === email)) {
            document.getElementById("emailError").textContent = "Email already registered.";
            message.textContent = "Registration failed.";
            message.className = "failure";
            return;
        }

        employees.push({ name, email, phone, department, salary, gender });
        displayEmployees();
        form.reset();

        message.textContent = "Employee registered successfully!";
        message.className = "success";
    });

    function displayEmployees() {
        table.replaceChildren();

        if (employees.length === 0) {
            table.innerHTML = '<tr><td colspan="8">No employees registered yet.</td></tr>';
            highestSalary.textContent = "No employees registered yet.";
            return;
        }

        employees.forEach((emp, index) => {
            const row = table.insertRow();

            [index + 1, emp.name, emp.email, emp.phone, emp.department,
                "₹" + emp.salary.toLocaleString("en-IN"), emp.gender
            ].forEach(value => {
                row.insertCell().textContent = value;
            });

            const cell = row.insertCell();
            const button = document.createElement("button");

            button.textContent = "Delete";
            button.type = "button";
            button.className = "delete-btn";

            button.addEventListener("click", () => {
                employees.splice(index, 1);
                displayEmployees();
                message.textContent = "Employee record deleted.";
                message.className = "success";
            });

            cell.appendChild(button);
        });

        const maxSalary = Math.max(...employees.map(emp => emp.salary));
        const topEmployees = employees.filter(emp => emp.salary === maxSalary);

        highestSalary.textContent = topEmployees.map(emp =>
            `${emp.name} — ₹${emp.salary.toLocaleString("en-IN")} per month`
        ).join(" | ");
    }

    form.addEventListener("reset", () => {
        document.querySelectorAll(".error").forEach(el => el.textContent = "");
        message.textContent = "";
        message.className = "";
    });
});
