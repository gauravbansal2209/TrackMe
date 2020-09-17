$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const MQTT_URL = 'http://localhost:5001/system-control';
const API_URL = 'http://localhost:5000/api';

const currentUser = localStorage.getItem('name');

if(currentUser == "admin")
{
    $.get(`${API_URL}/plants`).then(response =>
    {
        response.forEach(plant =>
        {
            $('#plants tbody').append(`
            <tr data-plant-id=${plant._id}>
            <td>
            <div class="card" style="width:200px">
                <div class="card-body">
                    <h4 class="card-title">${plant.name}</h4>
                    <button class="btn btn-primary">See Plant History</a>
                </div>
            </div>
            </td>
            </tr>`
            );
        });

        $('#plants tbody tr').on('click', () => {
            $.get(`${API_URL}/plants`).then(response => 
            {
                response.forEach((plant) => {
                $('#historyContent').append(`
                    <tr>
                    <td>${plant.user}</td>
                    <td>${plant.temp + '°'}</td>
                    <td>${plant.light + ' LUX'}</td>
                    <td>${plant.humidity + ' %RH'}</td>
                    <td>${plant.moisture + ' MU'}</td>
                    </tr>
                `);
                });
                $('#historyModal').modal('show');
            });
        });
    }).catch(error =>
    {
        console.error(`Error: ${error}`);
    });
}
else if (currentUser)
{
    $.get(`${API_URL}/users/${currentUser}/plants`).then(response => 
    {
        response.forEach((plant) => 
        {
            $('#plants tbody').append(`
            <tr data-plant-id=${plant._id}>
            <td>
            <div class="card" style="width:200px">
                <div class="card-body">
                    <h4 class="card-title">${plant.name}</h4>
                    <button class="btn btn-primary">See Plant History</a>
                </div>
            </div>
            </td>
            </tr>`);
        });

        $('#plants tbody tr button').on('click', () => {
            $.get(`${API_URL}/users/${currentUser}/plants`).then(response => 
            {
                response.forEach((plant) => {
                $('#historyContent').append(`
                    <tr>
                    <td>${plant.user}</td>
                    <td>${plant.temp + '°'}</td>
                    <td>${plant.light + ' LUX'}</td>
                    <td>${plant.humidity + ' %RH'}</td>
                    <td>${plant.moisture + ' MU'}</td>
                    </tr>
                `);
                });
                $('#historyModal').modal('show');
            });
        });
        
    }).catch(error => 
    {
        console.error(`Error: ${error}`);
    });
}
else 
{
    const path = window.location.pathname;
    if (path !== '/login' && path !== '/registration') 
    {
        location.href = '/login';
    }
}
   
$('#add-plant').on('click', () => 
{
    const name = $('#name').val();
    const user = $('#user').val();
    const temp = $('#temp').val();
    const light = $('#light').val();
    const humidity = $('#humidity').val();
    const moisture = $('#moisture').val();
    const body = 
    {
        name,
        user,
        temp,
        light,
        humidity,
        moisture
    };

    $.post(`${API_URL}/plants`, body).then(response => 
    {
        location.href = '/';
    }).catch(error => 
    {
        console.error(`Error: ${error}`);
    });
});

$('#system-control').on('click', function()
{
    const command = $('#command').val();
    const plantID = $('#plantID').val();

    $.post(`${MQTT_URL}/system-control`, { command, plantID });
});

$('#register').on('click', () =>
{
    const name = $('#username').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();

    if (password != confirm)
    {
        $('#alert').append(`<p class="alert alert-danger">Passwords do not match</p>`);
    }
    else
    {
        $.post(`${API_URL}/registration`, { name, password }).then((response) =>
        {
            if (response.success) 
            {
                location.href = '/login';
            } 
            else 
            {
                $('#alert').append(`<p class="alert alert-danger">${response}</p>`); 
            }
        });
    }
});

$('#login').on('click', () => 
{
    const username = $('#username').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { "name": username, password }).then((response) =>
    {
        if (response.success) 
        {
            localStorage.setItem('name', username);
            localStorage.setItem('isAuthenticated', true);
            location.href = '/plant-data';
        } 
        else 
        {
            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });
});

const logout = () => 
{
    localStorage.removeItem('name');
    localStorage.removeItem('isAuthenticated');   
    location.href = '/login';
}  