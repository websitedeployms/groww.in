/* One-time simulated portfolio sale for the Groww replica. This does not connect to a real broker. */
(function () {
  "use strict";

  var saleFlag = "groww_demo_sale_20261012_applied";
  var versionKey = "groww_demo_balance_version";
  var balanceKey = "groww_demo_cash_balance";
  var transactionKey = "groww_demo_transactions";
  var saleOrdersKey = "groww_demo_stock_sales";
  var withdrawalFlag = "groww_demo_withdrawal_10000_20261030_applied";
  var pendingKey = "groww_demo_pending_withdrawals";

  function applyDemoDecline() {
    var declineFlag = "groww_demo_withdrawal_10000_declined_refund_applied";
    var requestId = "demo-withdrawal-10000-20261031";
    var pending = parseArray(pendingKey);
    var transactions = parseArray(transactionKey);
    var hasRequest = pending.some(function (item) { return item && item.id === requestId; }) ||
      transactions.some(function (item) { return item && item.id === requestId; });
    if (!hasRequest) return;

    pending = pending.map(function (item) {
      if (item && item.id === requestId) {
        item.status = "Declined";
        item.title = "Withdraw declined";
        item.reason = "Withdrawal request declined";
        item.declinedAt = "2026-10-31T21:30:00+05:30";
      }
      return item;
    });
    transactions = transactions.map(function (item) {
      if (item && item.id === requestId) {
        item.status = "Declined";
        item.title = "Withdraw declined";
        item.side = "Debit";
        item.declinedAt = "2026-10-31T21:30:00+05:30";
        item.description = "Demo withdrawal request declined; amount returned to cash balance";
      }
      return item;
    });
    localStorage.setItem(pendingKey, JSON.stringify(pending));
    localStorage.setItem(transactionKey, JSON.stringify(transactions));

    if (localStorage.getItem(declineFlag) !== "1") {
      var balance = Number(localStorage.getItem(balanceKey));
      if (Number.isFinite(balance)) {
        localStorage.setItem(balanceKey, String(Number((balance + 10000).toFixed(2))));
      }
      localStorage.setItem(declineFlag, "1");
    }
  }


  function applyDemoFailureAndRefund() {
    var requestId = "demo-withdrawal-10000-20261031";
    var failedFlag = "groww_demo_withdrawal_failed_refund_tx_20261031_applied";
    var pending = parseArray(pendingKey);
    var transactions = parseArray(transactionKey);
    pending = pending.map(function (item) {
      if (item && item.id === requestId) {
        item.status = "Failed";
        item.title = "Withdraw failed";
        item.reason = "Withdrawal request failed";
        item.failedAt = "2026-10-31T21:45:00+05:30";
      }
      return item;
    });
    transactions = transactions.map(function (item) {
      if (item && item.id === requestId) {
        item.status = "Failed";
        item.title = "Withdraw failed";
        item.side = "Debit";
        item.failedAt = "2026-10-31T21:45:00+05:30";
        item.description = "Demo withdrawal request failed";
      }
      return item;
    });
    if (localStorage.getItem(failedFlag) !== "1") {
      transactions.unshift({
        id: "demo-withdrawal-refund-10000-20261031",
        type: "Refund",
        title: "Refund",
        amount: 10000,
        status: "Completed",
        side: "Credit",
        date: "2026-10-31T21:46:00+05:30",
        description: "Refund for failed demo withdrawal"
      });
      localStorage.setItem(failedFlag, "1");
    }
    localStorage.setItem(pendingKey, JSON.stringify(pending));
    localStorage.setItem(transactionKey, JSON.stringify(transactions));
  }

  function applyPendingFiveThousandWithdrawal() {
    var requestId = "demo-withdraw-pending-5000-20261031";
    var appliedFlag = "groww_demo_pending_withdraw_5000_balance_deducted";
    var pending = parseArray(pendingKey);
    var transactions = parseArray(transactionKey);
    var exists = pending.some(function (item) {
      return item && (item.id === requestId || (Number(item.amount) === 5000 && String(item.status || "").toLowerCase() === "pending"));
    }) || transactions.some(function (item) {
      return item && (item.id === requestId || (String(item.title || "").toLowerCase() === "withdraw" && Number(item.amount) === 5000 && String(item.status || "").toLowerCase() === "pending"));
    });
    if (!exists || localStorage.getItem(appliedFlag) === "1") return;
    var balance = Number(localStorage.getItem(balanceKey));
    if (Number.isFinite(balance) && balance >= 5000) {
      localStorage.setItem(balanceKey, String(Number((balance - 5000).toFixed(2))));
      localStorage.setItem(appliedFlag, "1");
    }
  }

  function applyDemoWithdrawal() {
    var requestFlag = "groww_demo_withdrawal_10000_v2_applied";
    if (localStorage.getItem(requestFlag) === "1") return;

    var balance = Number(localStorage.getItem(balanceKey));
    if (!Number.isFinite(balance) || balance < 10000) return;

    var requestDate = "2026-10-31T21:18:00+05:30";
    var pending = parseArray(pendingKey);
    if (!pending.some(function (item) { return item && item.id === "demo-withdrawal-10000-20261031"; })) {
      pending.unshift({ id: "demo-withdrawal-10000-20261031", amount: 10000, date: requestDate, status: "Pending" });
      localStorage.setItem(pendingKey, JSON.stringify(pending));
    }

    var transactions = parseArray(transactionKey);
    if (!transactions.some(function (item) { return item && item.id === "demo-withdrawal-10000-20261031"; })) {
      transactions.unshift({
        id: "demo-withdrawal-10000-20261031",
        type: "Withdraw",
        title: "Withdraw",
        amount: 10000,
        status: "Pending",
        side: "Debit",
        date: requestDate,
        description: "Demo withdrawal request to SBI ••••4181"
      });
      localStorage.setItem(transactionKey, JSON.stringify(transactions));
    }

    localStorage.setItem(balanceKey, String(Number((balance - 10000).toFixed(2))));
    localStorage.setItem(requestFlag, "1");
  }

  if (localStorage.getItem("groww_demo_logged_in") !== "1") return;

  var currentVersion = "11";
  var startingDemoBalance = 5744.58;
  var proceeds = 10704.78;
  var soldAt = new Date().toISOString();

  var sales = [
    { name: "Larsen & Toubro", symbol: "LT", quantity: 1, price: 4797.41, costBasis: 3876.20 },
    { name: "Tata Consultancy Services", symbol: "TCS", quantity: 1, price: 2547.60, costBasis: 2058.40 },
    { name: "Sun Pharma", symbol: "SUNPHARMA", quantity: 1, price: 2286.82, costBasis: 1847.70 },
    { name: "HDFC Bank", symbol: "HDFCBANK", quantity: 1, price: 875.70, costBasis: 707.55 },
    { name: "Wipro", symbol: "WIPRO", quantity: 1, price: 197.25, costBasis: 159.37 }
  ];

  function parseArray(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  if (localStorage.getItem(saleFlag) === "1") {
    // Keep the balance schema current without applying the sale twice.
    var existing = Number(localStorage.getItem(balanceKey));
    var storedVersion = localStorage.getItem(versionKey);
    // Repair the stale ₹39.80 value left by the previous demo balance version.
    if (!Number.isFinite(existing) || existing < 0 ||
        (storedVersion !== currentVersion && Math.abs(existing - 39.80) < 0.01)) {
      existing = startingDemoBalance;
      localStorage.setItem(balanceKey, String(startingDemoBalance));
    }
    localStorage.setItem(versionKey, currentVersion);
    applyDemoWithdrawal();
    applyDemoDecline();
    applyDemoFailureAndRefund();
    applyPendingFiveThousandWithdrawal();
    return;
  }

  var cash = Number(localStorage.getItem(balanceKey));
  if (!Number.isFinite(cash) || cash <= 0) cash = startingDemoBalance;
  localStorage.setItem(versionKey, currentVersion);
  localStorage.setItem(balanceKey, String(Number((cash + proceeds).toFixed(2))));

  var transactions = parseArray(transactionKey);
  if (!transactions.some(function (item) { return item && item.id === "stock-sale-20261012-demo"; })) {
    transactions.unshift({
      id: "stock-sale-20261012-demo",
      type: "Stocks",
      title: "Stocks sold",
      amount: proceeds,
      status: "Completed",
      side: "Credit",
      date: soldAt,
      description: "Simulated sale of 5 portfolio shares"
    });
    localStorage.setItem(transactionKey, JSON.stringify(transactions));
  }

  var saleOrders = parseArray(saleOrdersKey);
  if (!saleOrders.some(function (item) { return item && item.id === "stock-sale-20261012-demo-1"; })) {
    sales.forEach(function (item, index) {
      saleOrders.unshift({
        id: "stock-sale-20261012-demo-" + (index + 1),
        symbol: item.symbol,
        name: item.name,
        side: "SELL",
        quantity: item.quantity,
        price: item.price,
        amount: Number((item.quantity * item.price).toFixed(2)),
        status: "Executed",
        date: soldAt
      });
    });
    localStorage.setItem(saleOrdersKey, JSON.stringify(saleOrders));
  }

  localStorage.setItem(saleFlag, "1");
  applyDemoWithdrawal();
  applyDemoDecline();
  applyDemoFailureAndRefund();
  applyPendingFiveThousandWithdrawal();
})();