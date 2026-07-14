// Backend port running link
const API_URL = "http://localhost:5000/api/bikes";
let currentDetailBikeId = "";
window.onload = function () {
  loadBikes();
  loadReport();
  document.getElementById("detail-edit-button").onclick = function () {
    closeDetail();
    startEdit(currentDetailBikeId);
  };

  document.getElementById("detail-delete-button").onclick = function () {
    deleteBike(currentDetailBikeId);
  };
};
function loadBikes() {
  const searchValue = document.getElementById("search-box").value;
  const sortValue = document.getElementById("sort-select").value;

  let url = API_URL + "?search=" + encodeURIComponent(searchValue);
  if (sortValue) {
    url += "&sortBy=" + encodeURIComponent(sortValue);
  }

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (result.success) {
        displayBikeCards(result.data);
      }
    })
    .catch(function (error) {
      console.log("Error loading bikes:", error);
    });
}

function displayBikeCards(bikes) {
  const container = document.getElementById("bike-cards-container");
  container.innerHTML = ""; // clear old cards first

  if (bikes.length === 0) {
    container.innerHTML = "<p class='hint-text'>No bikes found.</p>";
    return;
  }

  bikes.forEach(function (bike) {
    const card = document.createElement("div");
    card.className = "bike-card";
    card.onclick = function () {
      openDetail(bike._id);
    };

    const statusClass = "status-" + bike.status.toLowerCase();

    card.innerHTML =
      "<div class='bike-card-header'>" +
      "<span class='bike-card-number'>" + bike.bikeNumber + "</span>" +
      "<span class='status-badge " + statusClass + "'>" + bike.status + "</span>" +
      "</div>" +
      "<p class='bike-card-title'>" + bike.brand + " - " + bike.bikeType + "</p>" +
      "<p class='bike-card-rate'>&euro;" + bike.dailyRate + " / day &middot; &euro;" + bike.weeklyRate + " / week</p>" +
      "<p class='bike-card-person'>" + (bike.personName ? "Person: " + bike.personName : "") + "</p>" +
      "<div class='bike-card-actions'>" +
      "<button onclick='event.stopPropagation(); startEdit(\"" + bike._id + "\")'>Edit</button>" +
      "<button onclick='event.stopPropagation(); deleteBike(\"" + bike._id + "\")'>Delete</button>" +
      "</div>";

    container.appendChild(card);
  });
}

function openDetail(id) {
  fetch(API_URL + "/" + id)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (!result.success) return;

      const bike = result.data;
      currentDetailBikeId = bike._id;

      const serviceDate = bike.lastServiceDate
        ? new Date(bike.lastServiceDate).toLocaleDateString()
        : "";

      document.getElementById("detail-bikeNumber").textContent = bike.bikeNumber;

      const statusBadge = document.getElementById("detail-status");
      statusBadge.textContent = bike.status;
      statusBadge.className = "status-badge status-" + bike.status.toLowerCase();

      document.getElementById("detail-bikeType").textContent = bike.bikeType;
      document.getElementById("detail-brand").textContent = bike.brand;
      document.getElementById("detail-colour").textContent = bike.colour;
      document.getElementById("detail-dailyRate").textContent = bike.dailyRate;
      document.getElementById("detail-weeklyRate").textContent = bike.weeklyRate;
      document.getElementById("detail-personName").textContent = bike.personName ? bike.personName : "-";
      document.getElementById("detail-lastServiceDate").textContent = serviceDate;

      document.getElementById("detail-overlay").style.display = "flex";
    })
    .catch(function (error) {
      console.log("Error loading bike details:", error);
    });
}

function closeDetail() {
  document.getElementById("detail-overlay").style.display = "none";
}

// ------------------------------------------------------------------
function closeDetailIfOverlay(event) {
  if (event.target.id === "detail-overlay") {
    closeDetail();
  }
}

function saveBike() {
  const id = document.getElementById("bike-id").value;

  const bikeData = {
    bikeNumber: document.getElementById("bikeNumber").value,
    bikeType: document.getElementById("bikeType").value,
    brand: document.getElementById("brand").value,
    colour: document.getElementById("colour").value,
    dailyRate: Number(document.getElementById("dailyRate").value),
    weeklyRate: Number(document.getElementById("weeklyRate").value),
    status: document.getElementById("status").value,
    personName: document.getElementById("personName").value,
  };

  const isEditing = id !== "";
  const url = isEditing ? API_URL + "/" + id : API_URL;
  const method = isEditing ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bikeData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      const messageBox = document.getElementById("form-message");
      messageBox.textContent = result.message;

      if (result.success) {
        clearForm();
        loadBikes();
        loadReport();
      }
    })
    .catch(function (error) {
      console.log("Error saving bike:", error);
    });
}

function startEdit(id) {
  fetch(API_URL + "/" + id)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (!result.success) return;

      const bike = result.data;

      document.getElementById("bike-id").value = bike._id;
      document.getElementById("bikeNumber").value = bike.bikeNumber;
      document.getElementById("bikeType").value = bike.bikeType;
      document.getElementById("brand").value = bike.brand;
      document.getElementById("colour").value = bike.colour;
      document.getElementById("dailyRate").value = bike.dailyRate;
      document.getElementById("weeklyRate").value = bike.weeklyRate;
      document.getElementById("status").value = bike.status;
      document.getElementById("personName").value = bike.personName || "";

      document.getElementById("form-title").textContent = "Edit Bike";
      document.getElementById("save-button").textContent = "Update Bike";
      document.getElementById("cancel-button").style.display = "inline-block";

      // Scroll up to the form so the user can see what they're editing.
      document.getElementById("form-section").scrollIntoView({ behavior: "smooth" });
    });
}

function cancelEdit() {
  clearForm();
}

function clearForm() {
  document.getElementById("bike-id").value = "";
  document.getElementById("bikeNumber").value = "";
  document.getElementById("bikeType").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("colour").value = "";
  document.getElementById("dailyRate").value = "";
  document.getElementById("weeklyRate").value = "";
  document.getElementById("status").value = "Available";
  document.getElementById("personName").value = "";

  document.getElementById("form-title").textContent = "Add a New Bike";
  document.getElementById("save-button").textContent = "Add Bike";
  document.getElementById("cancel-button").style.display = "none";
}

function deleteBike(id) {
  const confirmed = confirm("Are you sure you want to delete this bike?");
  if (!confirmed) return;

  fetch(API_URL + "/" + id, { method: "DELETE" })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (result.success) {
        closeDetail();
        loadBikes();
        loadReport();
      }
    })
    .catch(function (error) {
      console.log("Error deleting bike:", error);
    });
}

function loadReport() {
  fetch(API_URL + "/report/summary")
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (!result.success) return;

      const r = result.data;
      const reportText =
        "Total bikes: " + r.totalBikes +
        " | Available: " + r.availableBikes +
        " | Rented: " + r.rentedBikes +
        " | Under Maintenance: " + r.maintenanceBikes;

      document.getElementById("report-text").textContent = reportText;
    })
    .catch(function (error) {
      console.log("Error loading report:", error);
    });
}
