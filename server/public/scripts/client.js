$(document).ready(onReady);

function onReady() {
    // Add task button
    $('#submit-btn').on('click', handleAddTask);
    renderTasks();
}

// Appends all tasks to the DOM, uses ajax GET request.
function renderTasks() {
    // Get data from database
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).then((response) => {
        console.log('response GET:', response);
        // Append tasks
        for (let task of response) {
            $('#list').append(`
            <tr>
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.status}</td>
                <td><button class="edit-btn" data-id="${task.id}" data-status="${task.status}>Edit</button></td>
                <td><button class="edit-btn" data-id="${task.id}" data-status="${task.status}>Edit</button></td>
            </tr>
            `);
        }
    }).catch((error) => {
        console.log('error GET:', error);
    })
}


// Save's input values into "taskData" object.
    // Makes an ajax POST request, to put the data on the server.
function handleAddTask() {
    let taskData = {
        title: $('#title').val(),
        description: $('#description').val()
    }
    // POST route
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: taskData
    }).then((response) => {
        console.log('response POST:', response);
    }).catch((error) => {
        console.log('error POST:', error);
    })
}
