let accounts = [];
const appendedAccounts = [];
const changedAccounts = [];
const input = document.querySelector("#manageAdminsSearchInput");
const container = document.querySelector("#manageAdminsSearchRecommendations");
const accountsTable = document.querySelector("#accountsTableBody");

async function fetchAccounts() {
    accounts = await fetch('/api/accounts').then(response => response.json());
}

function searchAccount(input) {
    const result = accounts.filter(account => {
        const regex = new RegExp(input, "gi");
        const a = regex.test(account.email);
        const b = regex.test(account.firstName);
        const c = regex.test(account.lastName);

        return regex.test(`${account.email} ${account.firstName} ${account.lastName}`);
    });

    return result.slice(0,3);
}

function populateRecommendations() {
    const recommendations = searchAccount(input.value);

    container.style.display = "none";
    container.innerHTML = "";

    if (recommendations.length === 0) {
        const button = document.createElement("button");
        button.classList.add("list-group-item", "list-group-item-action");
        button.setAttribute("type", "button");
        button.disabled = true;
        button.innerHTML = "No results found";

        container.appendChild(button);
    }
    else {
        for (let recommendation of recommendations) {
            const button = document.createElement("button");
            button.classList.add("list-group-item", "list-group-item-action");
            button.setAttribute("type", "button");
            button.addEventListener("click", appendAccount);
    
            const outerDiv = document.createElement("div");
            outerDiv.classList.add("ms-2", "me-auto");
    
            const innerNameDiv = document.createElement("div");
            innerNameDiv.classList.add("fw-bold");
            innerNameDiv.innerHTML = `${recommendation.lastName}, ${recommendation.firstName}`;
            outerDiv.appendChild(innerNameDiv);
    
            const innerEmailDiv = document.createElement("div");
            innerEmailDiv.classList.add("text-secondary", "emailDiv");
            innerEmailDiv.innerHTML = recommendation.email;
            outerDiv.appendChild(innerEmailDiv);
    
            button.appendChild(outerDiv);
            container.appendChild(button);
        }
    }

    container.style.display = "flex";
}

function appendAccount(event) {
    const account = accounts.find(account => account.email === event.currentTarget.children[0].children[1].innerHTML);
    appendedAccounts.push(account);
    accounts.splice(accounts.indexOf(account), 1);

    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.innerHTML = `${account.lastName}, ${account.firstName}`;
    row.appendChild(nameCell);

    const emailCell = document.createElement("td");
    emailCell.innerHTML = account.email;
    row.appendChild(emailCell);

    const checkboxCell = document.createElement("td");
    checkboxCell.classList.add("checkboxCell");
    const checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("form-check");

    const checkboxinput = document.createElement("input");
    checkboxinput.classList.add("form-check-input");
    checkboxinput.setAttribute("type", "checkbox");
    checkboxinput.setAttribute("data-account", account.email);
    checkboxinput.checked = account.isAdministrator;
    checkboxinput.addEventListener("change", changeState);

    checkboxDiv.appendChild(checkboxinput);
    checkboxCell.appendChild(checkboxDiv);
    
    row.appendChild(checkboxCell);

    accountsTable.appendChild(row);
    container.style.display = "none";
    input.value = "";
}

function changeState(event) {
    const account = appendedAccounts.find(account => account.email === event.currentTarget.dataset.account);
    account.isAdministrator = event.currentTarget.checked;

    if (!changedAccounts.includes(account)) {
        changedAccounts.push(account);
    }
    else {
        changedAccounts.splice(changedAccounts.indexOf(account), 1);
    }

    console.log(changedAccounts);
}

async function handleSaveAdmins() {
    const response = await fetch('/api/adminAccounts', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(changedAccounts)
    });

    if (response.status === 200) {
        const modal = bootstrap.Modal.getInstance(document.querySelector("#manageAdminsModal"));
        modal.hide();
    }
}

document.querySelector("#manageAdminsButton").addEventListener("click", async () => {
    await fetchAccounts();
});

input.addEventListener("keyup", populateRecommendations);

document.querySelector("#manageAdminsModalButton").addEventListener("click", async () => {
    await handleSaveAdmins();
    location.reload();
});