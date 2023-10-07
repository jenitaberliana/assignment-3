const categories = document.getElementById("categories");
const result = document.getElementById("result");
const url = "http://localhost:3000/data";

const categoriesList = [
    "Fashion",
    "Beauty",
    "Electronics",
    "Accessories",
    "Health",
    "Food & Drink"
];

categoriesList.forEach((element) => {
    const newOption = document.createElement('option');
    const optionText = document.createTextNode(element);
    newOption.appendChild(optionText);
    newOption.setAttribute('value', element);

    categories.appendChild(newOption)
});

function fetchData() {
    result.innerHTML = "Loading...";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            result.innerHTML = "";
            data.forEach(data => {
                const node = document.createElement("div");
                node.innerHTML = `
                    <div class="card mb-3 text-bg-light" style="width: 18rem;">
                        <img src="${data.img}" class="card-img-top" style="height: 20rem;">
                        <div class="card-body">
                            <h5 class="card-title">Name : ${data.name}</h5>
                            <h5 class="card-text">Category: ${data.categories}</h5>
                            <a href="#" class="btn btn-danger" onclick="deleteData(${data.id})"><i class="bi bi-trash3"></i></a>
                            <a href="#" class="btn btn-primary" onclick="editData(${data.id})"><i class="bi bi-pencil-square"></i></a>
                            <a href="#" class="btn btn-success" onclick="detailData(${data.id})"><i class="bi bi-eye"></i></a>
                        </div>
                    </div>
                `;
                result.appendChild(node);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            result.innerHTML = "Error fetching data.";
        });
}

function postData(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const img = document.getElementById("img").value; 
    const categories = document.getElementById("categories").value;

    const data = {
        name,
        img, 
        categories
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            document.getElementById("name").value = "";
            document.getElementById("img").value = "";
            document.getElementById("categories").value = "";
            fetchData();
        } else {
            console.error("Failed to add product.");
        }
    })
    .catch(error => console.error("Error adding product:", error));
}

function deleteData(id) {
    fetch(`${url}/${id}`, {
        method: "DELETE",
    })
}

function editData(id) {
    fetch(`${url}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                document.getElementById("name").value = data.name;
                document.getElementById("img").value = data.img; 
                document.getElementById("categories").value = data.categories;

                document.getElementById("form").addEventListener("submit", function handleSubmit(event) {
                    event.preventDefault();
                    const name = document.getElementById("name").value;
                    const img = document.getElementById("img").value;
                    const categories = document.getElementById("categories").value;

                    if (name && img && categories) {
                        const updatedData = {
                            name,
                            img, 
                            categories
                        };

                        fetch(`${url}/${id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(updatedData),
                        })
                        .then(response => {
                            if (response.status === 200) {
                                result.innerHTML = "";
                                fetchData();

                                document.getElementById("name").value = "";
                                document.getElementById("img").value = "";
                                document.getElementById("categories").value = "";
                            } else {
                                console.error("Failed to update product.");
                            }
                        })
                        .catch(error => console.error("Error updating product:", error));
                    }
                });
            }
        })
        .catch(error => console.error("Error fetching product details:", error));
}


function detailData(id) {
    fetch(`${url}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            const modal = new bootstrap.Modal(document.getElementById("detail-modal"));
            document.getElementById("modal-title").innerText = data.name;
            document.getElementById("modal-body").innerHTML = `
                <img src="${data.img}" alt="${data.name}" style="max-width: 200px; margin-bottom: 10px;">
                <table style="border-collapse: collapse; width: 300px;">
                <tr>
                    <td>ID</td>
                    <td style="border-bottom: 1px solid gray;">${data.id}</td>
                </tr>
                <tr>
                    <td>Name</td>
                    <td style="border-bottom: 1px solid grey;">${data.name}</td>
                </tr>
                <tr>
                    <td>Category</td>
                    <td style="border-bottom: 1px solid grey;">${data.categories}</td>
                </tr>
                </table>
            `;
            modal.show();
        })
        .catch(error => console.error("Error fetching product details:", error));
}

fetchData();