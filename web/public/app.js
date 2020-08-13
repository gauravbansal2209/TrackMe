
$('#navbar').load('navbar.html');

$('#footer').load('footer.html');

const API_URL = 'http://localhost:5000/api';

const currentUser = localStorage.getItem('user');

const devices = JSON.parse(localStorage.getItem('devices')) || [];
//const users = localStorage.getItem('users') || [];

if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`)
        .then(response => {
            response.forEach((device) => {
                $('#devices tbody').append(`
                <tr data-device-id=${device._id}>
                    <td>${device.user}</td>
                    <td>${device.name}</td>
                </tr>`
                );
            });
            $('#devices tbody tr').on('click', (e) => {
                const deviceId = e.currentTarget.getAttribute('data-device-id');
                $.get(`${API_URL}/devices/${deviceId}/device-history`)
                .then(response => {
                    response.map(sensorData => {
                    $('#historyContent').append(`
                        <tr>
                        <td>${sensorData.ts}</td>
                        <td>${sensorData.temp}</td>
                        <td>${sensorData.loc.lat}</td>
                        <td>${sensorData.loc.lon}</td>
                        </tr>
                    `);
                    });
                    $('#historyModal').modal('show');
                });
            });
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
} else {
    const path = window.location.pathname;
    if (path !== '/login' && path !== '/registration') {
        location.href = '/login';
    }
}

$.get(`${API_URL}/devices `)
    .then(response => {
        response.forEach(device => {
            $('#devices tbody').append(`
            <tr>
            <td>${device.user}</td>
            <td>${device.name}</td>
            </tr>`
            );
        });
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });


$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
        name,
        user,
        sensorData
    };
    $.post(`${API_URL}/devices`, body)
        .then(response => {
            location.href = '/';
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
});

$('#register-button').on('click', () => {
    var name = $('#user').val();
    var password = $('#password').val();
    var confirmpassword = $('#confirmpassword').val();

    $.post(` ${API_URL}/registration `, { name, password, isAdmin: false })
        .then((response) => {
            if (response == "User already exists!") {
                alert("User already exists!");
                location.href = '/login';
            }else if (response.message == "Created new User") {
                //alert("Dekho");
                    if (password == confirmpassword) {
                        localStorage.setItem('users', name);
                        localStorage.setItem('isAdmin', response.comfirmpassword);
                        location.href = '/login';
                    }else 
                    alert("Passwords do not match, please try again!");

                    }else {
                    $('#message').append(` <p class="alert alert-danger">${response}<p> `);
                    }
        });
});

$('#login-button').on('click', () => {
    const name = $('#user').val();
    const password = $('#password').val();

    $.post(` ${API_URL}/authenticate `, { name, password })
        .then((response) => {
            console.log(response);
            if (response == "User does not exist!") {
                alert("User does not exist. Create an account!");
                location.href = '/registration';
            }
            if (response == "Incorrect Password!") {
                alert("Incorrect Password!");
            }
            if (response.success) {
                localStorage.setItem('user', name);
                localStorage.setItem('isAdmin', response.isAdmin);
                localStorage.setItem('isAuthenticated', true);
                location.href = '/';
            } else {
                $('#message').append(` <p class="alert alert-danger">${response}<p> `);
            }
        });
});

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
}

$('#send-command').on('click', function() { 
    const command = $('#command').val(); 
    console.log(`command is: ${command}`);
});
