document.getElementById("checkBtn").addEventListener("click", async () => {
  const text = document.getElementById("newsText").value.trim();

  if (!text) {
    document.getElementById("result").innerText = "Please enter some news content.";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const result = await response.json();
    document.getElementById("result").innerHTML = `
      <strong>Prediction:</strong> ${result.prediction}<br>
      <strong>Confidence:</strong> ${(result.confidence * 100).toFixed(2)}%
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("result").innerText = "Error: Could not connect to the backend API.";
  }
});
