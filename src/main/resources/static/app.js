$(async function () {
    await allUsers();
    await newUser();
    editUser();
    deleteUser()
});

const table = $('#allUsersTable');

async function allUsers() {
    table.empty()
    fetch("http://localhost:8095/api/users")
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                let tableWithUser = `$(
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.login}</td>
                <td>${user.roles.map(role => role.name.substring(5).concat(" ")).toString().replaceAll(",", "")}</td>
                <td>
                    <button type="button" class="btn btn-info" data-toggle="modal" id="buttonEdit"
                    data-action="editModal" data-id="${user.id}" data-target="#editModal">Edit</button>
                </td>
                <td>
                    <button type="button" class="btn btn-danger" data-toggle="modal" id="buttonDelete"
                    data-action="deleteModal" data-id="${user.id}" data-target="#deleteModal">Delete</button>
                </td>
            </tr>)`;
                table.append(tableWithUser);
            })
        })
}

async function newUser() {
    await fetch("http://localhost:8095/api/roles")
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let el = document.createElement("option");
                el.text = role.name.substring(5);
                el.value = role.id;
                $('#newUserRoles')[0].appendChild(el);
            })
        })
    const form = document.forms["formNewUser"];
    form.addEventListener('submit', addNewUser)

    function addNewUser(e) {
        e.preventDefault();
        let newUserRoles = [];
        if (form.roles !== undefined) {
            for (let i = 0; i < form.roles.options.length; i++) {
                if (form.roles.options[i].selected) newUserRoles.push({
                    id: form.roles.options[i].value,
                    name: "ROLE_" + form.roles.options[i].text
                })
            }
        }
        fetch("http://localhost:8095/api/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: form.name.value,
                login: form.login.value,
                password: form.password.value,
                roles: newUserRoles
            })
        }).then(() => {
            form.reset();
            allUsers();

            $('#editFormCloseButton').click();
        })
    }
}

// Получение пользователя по ID
async function getUser(id) {
    let response = await fetch(`http://localhost:8095/api/users/${id}`);
    if (response.ok) {
        return response.json();  // Возвращаем данные пользователя
    } else {
        throw new Error('Ошибка при получении данных пользователя');
    }
}

$('#editModal').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showEditModal(id);
})

$('#deleteModal').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showDeleteModal(id);
})

async function showEditModal(id) {
    let user = await getUser(id);
    let form = document.forms["formEditUser"];
    form.id.value = user.id;
    form.name.value = user.name;
    form.login.value = user.login;
    form.password.value = user.password;
    $('#rolesEditUser').empty();

    await fetch("http://localhost:8095/api/roles")
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].name === role.name) {
                        selectedRole = true;
                        break;
                    }
                }
                let el = document.createElement("option");
                el.text = role.name.substring(5);
                el.value = role.id;
                if (selectedRole) el.selected = true;
                $('#rolesEditUser')[0].appendChild(el);
            })
        })
}

async function showDeleteModal(id) {
    let user = await getUser(id);
    let form = document.forms["formDeleteUser"];
    form.id.value = user.id;
    form.name.value = user.name;
    form.login.value = user.login;

    $('#rolesDeleteUser').empty();

    await fetch("http://localhost:8095/api/roles")
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].name === role.name) {
                        selectedRole = true;
                        break;
                    }
                }
                let el = document.createElement("option");
                el.text = role.name.substring(5);
                el.value = role.id;
                if (selectedRole) el.selected = true;
                $('#rolesDeleteUser')[0].appendChild(el);
            })
        });
}

function editUser() {
    const editForm = document.forms["formEditUser"];
    editForm.addEventListener("submit", ev => {
        ev.preventDefault();
        let editUserRoles = [];
        if (editForm.roles !== undefined) {
            for (let i = 0; i < editForm.roles.options.length; i++) {
                if (editForm.roles.options[i].selected) editUserRoles.push({
                    id: editForm.roles.options[i].value,
                    name: "ROLE_" + editForm.roles.options[i].text
                })
            }
        }

        fetch("http://localhost:8095/api/users/" + editForm.id.value, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editForm.id.value,
                name: editForm.name.value,
                login: editForm.login.value,
                password: editForm.password.value,
                roles: editUserRoles
            })
        }).then(() => {
            $('#editFormCloseButton').click();
            allUsers();
            $('#editModal').modal('hide')
        })
    })
}

function deleteUser(){
    const deleteForm = document.forms["formDeleteUser"];
    deleteForm.addEventListener("submit", ev => {
        ev.preventDefault();
        fetch("http://localhost:8095/api/users/" + deleteForm.id.value, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                $('#deleteFormCloseButton').click();
                allUsers();
                $('#deleteModal').modal('hide')
            })
    })
}
