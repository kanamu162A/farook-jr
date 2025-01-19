document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const narrationInput = document.getElementById("narration");
  const dateInput = document.getElementById("date");
  const errorMessage = document.getElementById("error-message");
  const transactionBody = document.getElementById("transaction-body");

  // Create a NumberFormat instance for currency formatting without the currency symbol
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  async function fetchTransactions() {
    const narration = narrationInput.value.trim();
    const date = dateInput.value;

    errorMessage.textContent = "";
    transactionBody.innerHTML = "";

    try {
      const response = await fetch("https://nnl66gw8-3355.uks1.devtunnels.ms/serchtransaction/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ narration, date }),
        });
        

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      if (data.transactions.length === 0) {
        errorMessage.textContent = "No transactions found.";
        return;
      }

      data.transactions.forEach((txn) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${txn.d}</td>
          <td>${txn.date}</td>
          <td>${txn.account_name}</td>
          <td>${txn.transaction_status}</td>
          <td>${txn.transaction_ref}</td>
          <td>${currencyFormatter.format(txn.settlement_debit || 0)}</td>
          <td>${currencyFormatter.format(txn.settlement_credit || 0)}</td>
          <td>${currencyFormatter.format(txn.balance_before || 0)}</td>
          <td>${currencyFormatter.format(txn.balance_after || 0)}</td>
          <td>${txn.narration}</td>
        `;
        transactionBody.appendChild(row);
      });
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  }

  searchButton.addEventListener("click", fetchTransactions);
});
