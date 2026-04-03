let chartInstance = null;

async function runQuery() {
    try {
        const query = document.getElementById("query").value;

        const response = await fetch("http://127.0.0.1:8000/api/query/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();

        // ✅ HANDLE ERROR RESPONSE
        if (!Array.isArray(data)) {
            alert(data.error || data.message || "Invalid response");
            return;
        }

        // ================= TABLE =================
        let table = "<table border='1'><tr>";

        if (data.length > 0) {
            Object.keys(data[0]).forEach(col => {
                table += `<th>${col}</th>`;
            });
            table += "</tr>";

            data.forEach(row => {
                table += "<tr>";
                Object.values(row).forEach(val => {
                    table += `<td>${val}</td>`;
                });
                table += "</tr>";
            });
        }

        table += "</table>";
        document.getElementById("result").innerHTML = table;

        // ================= CHART =================
        if (data.length === 0) return;

        const labels = data.map(row => Object.values(row)[0]);

        // 🔥 SMART VALUES (important fix)
        const values = data.map(row => {
            const nums = Object.values(row).filter(v => typeof v === "number");
            return nums.length > 0 ? nums[0] : 1;
        });

        const ctx = document.getElementById('chart').getContext('2d');

        // destroy old chart
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Data Visualization',
                    data: values
                }]
            }
        });

    } catch (error) {
        console.error(error);
        alert("Error: " + error);
    }
}
chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Marks',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});