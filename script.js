let chartInstance = null;
let lastData = [];
// ================= HISTORY =================
function saveQuery(query) {
    let history = JSON.parse(localStorage.getItem("queryHistory")) || [];

    // avoid duplicates
    if (!history.includes(query)) {
        history.unshift(query);
    }

    // limit to last 5 queries
    if (history.length > 5) {
        history.pop();
    }

    localStorage.setItem("queryHistory", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem("queryHistory")) || [];
    const historyList = document.getElementById("history");

    historyList.innerHTML = "";

    history.forEach(q => {
        const li = document.createElement("li");
        li.textContent = q;

        li.style.cursor = "pointer";
        li.style.margin = "5px";
        li.style.padding = "5px";
        li.style.background = "#e9ecef";

        li.onclick = () => {
            document.getElementById("query").value = q;
        };

        historyList.appendChild(li);
    });
}

// load history on page load
window.onload = loadHistory;

// ================= MAIN FUNCTION =================
async function runQuery() {
    try {
        const query = document.getElementById("query").value;

        // save query
        saveQuery(query);

        const response = await fetch("http://127.0.0.1:8000/api/query/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();
        lastData = data;

        // 🔒 handle errors
        if (!Array.isArray(data)) {
            alert(data.error || data.message || "Invalid response");
            return;
        }

        // ================= TABLE =================
        let table = "<table><tr>";

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

        const values = data.map(row => {
            const nums = Object.values(row).filter(v => typeof v === "number");
            return nums.length > 0 ? nums[0] : 0;
        });

        const ctx = document.getElementById("chart").getContext("2d");

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Data Visualization",
                    data: values,
                    backgroundColor: "rgba(54, 162, 235, 0.6)"
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

    } catch (error) {
        console.error(error);
        alert("Error: " + error);
    }
}
function downloadCSV() {
    if (!lastData || lastData.length === 0) {
        alert("No data to download");
        return;
    }

    const headers = Object.keys(lastData[0]);
    const rows = lastData.map(row => headers.map(h => row[h]));

    let csvContent = headers.join(",") + "\n";

    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "query_results.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}
async function generateSQL() {
    const prompt = document.getElementById("query").value;

    const response = await fetch("http://127.0.0.1:8000/api/generate-sql/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    });

    const data = await response.json();

    document.getElementById("query").value = data.sql;
}
async function generateSQL() {
    const prompt = document.getElementById("query").value;

    const response = await fetch("http://127.0.0.1:8000/api/generate-sql/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    });

    const data = await response.json();

    if (data.sql) {
        document.getElementById("query").value = data.sql;
    } else {
        alert(data.error || "Error generating SQL");
    }
}
