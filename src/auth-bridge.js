/**
 * PCN Calculator Auth Bridge
 * This script adds Supabase integration to the PCN Calculator
 * without modifying the core calculator logic
 */

// Wrap in an IIFE to avoid global scope pollution
(function () {
  // Original localStorage methods we'll intercept
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  const originalRemoveItem = localStorage.removeItem;

  // Store a reference to the parent window (wrapper)
  const parent = window.parent;

  // Whether we are skipping Supabase sync
  let useLocalStorageOnly = false;

  // Listen for messages from the parent
  window.addEventListener("message", function (event) {
    const message = event.data;

    // Handle messages from the parent
    if (message && message.type === "LOAD_USER_DATA") {
      // Load user data from Supabase into localStorage
      loadUserData(message.userData);
    } else if (message && message.type === "GET_CURRENT_DATA") {
      // Parent is requesting current data
      sendCurrentData();
    } else if (message && message.type === "USE_LOCAL_STORAGE_ONLY") {
      // User chose to skip login
      useLocalStorageOnly = true;
    } else if (message && message.type === "LOGOUT") {
      // User logged out
      // We don't clear localStorage here, as the user might want to keep using
      // their data locally. Instead, we just set the flag to skip Supabase sync.
      useLocalStorageOnly = true;
    }
  });

  // Replace localStorage.setItem to intercept data changes
  localStorage.setItem = function (key, value) {
    // Call the original method
    originalSetItem.call(localStorage, key, value);

    // Notify parent that data has changed, only for keys we care about
    if (!useLocalStorageOnly && isRelevantKey(key)) {
      notifyParentOfDataChange();
    }
  };

  // Helper function to determine if a key is relevant for syncing
  function isRelevantKey(key) {
    const relevantKeys = [
      "pcnArrsStaffList",
      "pcnArrsMonthlyPrefs",
      "pcnFinancialEntitlements",
      "pcnArrsForecastScenarios",
    ];
    return relevantKeys.includes(key);
  }

  // Function to send current data to parent
  function sendCurrentData() {
    const staffList = originalGetItem.call(localStorage, "pcnArrsStaffList");
    const monthlyPrefs = originalGetItem.call(
      localStorage,
      "pcnArrsMonthlyPrefs"
    );
    const financialData = originalGetItem.call(
      localStorage,
      "pcnFinancialEntitlements"
    );
    const forecastScenarios = originalGetItem.call(
      localStorage,
      "pcnArrsForecastScenarios"
    );

    // Parse JSON if it exists, or use defaults
    const data = {
      staffList: staffList ? JSON.parse(staffList) : [],
      monthlyPrefs: monthlyPrefs ? JSON.parse(monthlyPrefs) : {},
      financialData: financialData ? JSON.parse(financialData) : {},
      forecastScenarios: forecastScenarios ? JSON.parse(forecastScenarios) : [],
    };

    // Send data to parent
    parent.postMessage(
      {
        type: "CURRENT_DATA",
        data: data,
      },
      "*"
    );
  }

  // Function to notify parent that data has changed
  function notifyParentOfDataChange() {
    // Simple notification to parent that something changed
    parent.postMessage(
      {
        type: "DATA_UPDATED",
      },
      "*"
    );
  }

  // Function to load user data from Supabase into localStorage
  function loadUserData(userData) {
    // Only update if we actually have data
    if (userData.staffList && userData.staffList.length > 0) {
      originalSetItem.call(
        localStorage,
        "pcnArrsStaffList",
        JSON.stringify(userData.staffList)
      );
    }

    if (
      userData.monthlyPrefs &&
      Object.keys(userData.monthlyPrefs).length > 0
    ) {
      originalSetItem.call(
        localStorage,
        "pcnArrsMonthlyPrefs",
        JSON.stringify(userData.monthlyPrefs)
      );
    }

    if (
      userData.financialData &&
      Object.keys(userData.financialData).length > 0
    ) {
      originalSetItem.call(
        localStorage,
        "pcnFinancialEntitlements",
        JSON.stringify(userData.financialData)
      );
    }

    if (userData.forecastScenarios && userData.forecastScenarios.length > 0) {
      originalSetItem.call(
        localStorage,
        "pcnArrsForecastScenarios",
        JSON.stringify(userData.forecastScenarios)
      );
    }

    // Trigger page reload to apply the new data
    window.location.reload();
  }

  // Log that the bridge is loaded
  console.log("PCN Calculator Auth Bridge loaded");
})();
