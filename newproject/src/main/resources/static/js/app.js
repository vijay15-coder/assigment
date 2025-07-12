document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const addBtn = document.getElementById("add-btn");
  const employeeList = document.getElementById("employee-list");
  const paginationControls = document.getElementById("pagination-controls");

  const formContainer = document.getElementById("form-container");
  const employeeForm = document.getElementById("employee-form");
  const cancelBtn = document.getElementById("cancel-btn");

  const firstNameInput = document.getElementById("first-name");
  const lastNameInput = document.getElementById("last-name");
  const emailInput = document.getElementById("email");
  const departmentInput = document.getElementById("form-department");
  const roleInput = document.getElementById("form-role");
  const formTitle = document.getElementById("form-title");

  // Filter elements
  const filterBtn = document.getElementById("filter-btn");
  const filterPanel = document.getElementById("filter-panel");
  const applyFilterBtn = document.getElementById("apply-filter");
  const resetFilterBtn = document.getElementById("reset-filter");
  const closeFilterBtn = document.getElementById("close-filter");

  // Flag to track whether filter panel is being interacted with
  let isInteractingWithFilter = false;

  /**
   * Renders the list of employees for the current page.
   */
  function renderEmployees() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filteredEmployees.slice(start, end);

    employeeList.innerHTML = "";

    paginated.forEach(emp => {
      const card = document.createElement("div");
      card.className = "employee-card";
      card.dataset.id = emp.id;

      card.innerHTML = `
        <h3>${emp.firstName} ${emp.lastName}</h3>
        <p>ID: ${emp.id}</p>
        <p>Email: ${emp.email}</p>
        <p>Department: ${emp.department}</p>
        <p>Role: ${emp.role}</p>
        <button class="edit-btn" data-id="${emp.id}">Edit</button>
        <button class="delete-btn" data-id="${emp.id}">Delete</button>
      `;

      employeeList.appendChild(card);
    });

    setupEventListeners();
    renderPagination();
  }

  /**
   * Adds event listeners to dynamic elements like edit/delete buttons.
   */
  function setupEventListeners() {
    // Delete button
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm("Are you sure you want to delete this employee?")) {
          mockEmployees = mockEmployees.filter(emp => emp.id !== id);
          refreshData();
        }
      });
    });

    // Edit button
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const emp = mockEmployees.find(emp => emp.id === id);
        if (!emp) return;
        editId = id;
        formTitle.textContent = "Edit Employee";
        firstNameInput.value = emp.firstName;
        lastNameInput.value = emp.lastName;
        emailInput.value = emp.email;
        departmentInput.value = emp.department;
        roleInput.value = emp.role;
        formContainer.classList.remove("hidden");
      });
    });
  }

  /**
   * Handles all filter panel related interactions.
   */
  function setupFilterPanel() {
    // Open/close filter panel
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFilterPanel();
    });

    // Apply filter without closing the panel
    applyFilterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      refreshData();
    });

    // Reset filter fields without closing the panel
    resetFilterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("filter-name").value = "";
      document.getElementById("filter-department").value = "";
      document.getElementById("filter-role").value = "";
      refreshData();
    });

    // Close button
    closeFilterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      filterPanel.classList.add("hidden");
    });

    // Keep it open on interaction
    filterPanel.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close if clicking outside
    document.addEventListener("click", () => {
      filterPanel.classList.add("hidden");
    });
  }

  /**
   * Toggles filter panel open/close safely.
   */
  function toggleFilterPanel() {
    const isHidden = filterPanel.classList.contains("hidden");
    document.querySelectorAll(".filter-panel").forEach(panel => panel.classList.add("hidden"));
    if (isHidden) {
      filterPanel.classList.remove("hidden");
    }
  }

  /**
   * Filters, sorts and updates the employee list.
   */
  function refreshData() {
    filteredEmployees = filterAndSort(mockEmployees);
    currentPage = 1;
    renderEmployees();
  }

  /**
   * Filters and sorts employee data based on UI inputs.
   */
  function filterAndSort(data) {
    let result = [...data];

    const nameFilter = document.getElementById("filter-name").value.toLowerCase();
    const deptFilter = document.getElementById("filter-department").value.toLowerCase();
    const roleFilter = document.getElementById("filter-role").value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    // Filters
    if (nameFilter) {
      result = result.filter(emp =>
        emp.firstName.toLowerCase().includes(nameFilter) ||
        emp.lastName.toLowerCase().includes(nameFilter)
      );
    }

    if (deptFilter) {
      result = result.filter(emp => emp.department.toLowerCase().includes(deptFilter));
    }

    if (roleFilter) {
      result = result.filter(emp => emp.role.toLowerCase().includes(roleFilter));
    }

    // Search
    if (searchTerm) {
      result = result.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    const sortBy = sortSelect.value;
    if (sortBy === "name") {
      result.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === "department") {
      result.sort((a, b) => a.department.localeCompare(b.department));
    }

    return result;
  }

  /**
   * Renders pagination buttons based on filtered data.
   */
  function renderPagination() {
    paginationControls.innerHTML = "";
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.disabled = true;

      btn.addEventListener("click", () => {
        currentPage = i;
        renderEmployees();
      });

      paginationControls.appendChild(btn);
    }
  }

  /**
   * Set up all global/static UI event listeners (form, search, pagination).
   */
  function setupStaticEvents() {
    // Search bar
    searchInput.addEventListener("input", refreshData);

    // Sorting
    sortSelect.addEventListener("change", () => {
      currentPage = 1;
      refreshData();
    });

    // Pagination control
    document.getElementById("items-per-page").addEventListener("change", (e) => {
      itemsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderEmployees();
    });

    // Add button
    addBtn.addEventListener("click", () => {
      editId = null;
      formTitle.textContent = "Add Employee";
      employeeForm.reset();
      formContainer.classList.remove("hidden");
    });

    // Cancel button
    cancelBtn.addEventListener("click", () => {
      formContainer.classList.add("hidden");
      employeeForm.reset();
    });

    // Form submission
    employeeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newEmp = {
        id: editId || Date.now(),
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value.trim(),
        role: roleInput.value.trim()
      };

      if (!newEmp.firstName || !newEmp.lastName || !newEmp.email || !newEmp.department || !newEmp.role) {
        alert("All fields are required.");
        return;
      }

      if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(newEmp.email)) {
        alert("Please enter a valid email.");
        return;
      }

      if (editId) {
        const index = mockEmployees.findIndex(emp => emp.id === editId);
        mockEmployees[index] = newEmp;
      } else {
        mockEmployees.push(newEmp);
      }

      refreshData();
      formContainer.classList.add("hidden");
    });
  }

  // Initialize everything
  setupFilterPanel();
  setupStaticEvents();
  refreshData();
});
