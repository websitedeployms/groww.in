/* One-time simulated portfolio sale for the Groww replica. This does not connect to a real broker. */
(function () {
  "use strict";

  var saleFlag = "groww_demo_sale_20261012_applied";
  var versionKey = "groww_demo_balance_version";
  var balanceKey = "groww_demo_cash_balance";
  var transactionKey = "groww_demo_transactions";
  var saleOrdersKey = "groww_demo_stock_sales";
  if (localStorage.getItem("groww_demo_logged_in") !== "1") return;

  var currentVersion = "7";
  var startingDemoBalance = 39.80;
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
    if (!Number.isFinite(existing) || existing < 0) {
      localStorage.setItem(balanceKey, String(startingDemoBalance));
    }
    localStorage.setItem(versionKey, currentVersion);
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
})();