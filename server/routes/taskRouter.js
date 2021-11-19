const express = require('express');
const router = express.Router();

// Connecting to the database
const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
    database: 'weekend-to-do-app',
    host: 'localhost'
  });

pool.on('connect', () => {
    console.log('Postgresql connected');
  });
  
  pool.on('error', (error) => {
    console.log('Error with postgres pool', error)
  });


// GET route
router.get('/', (req, res) => {
  const sqlText = 'SELECT * FROM tasks;'
  pool.query(sqlText)
    .then((dbRes) => {
      const taskFromDb = dbRes.rows;
      res.send(taskFromDb);
    }).catch((dbErr) => {
      console.error(dbErr);
    });
});

// POST route
router.post('/', (req, res) => {
    const newTask = req.body;
    const sqlText = (`
    INSERT INTO "tasks"
    ("title", "description", "status")
    VALUES
      ($1, $2, $3);
  `)
  const sqlValues = [
    newTask.title,
    newTask.description,
    'Incomplete'
  ]
  console.log('SQL:', sqlText)
  pool.query(sqlText, sqlValues)
    .then((dbRes) => {
      res.sendStatus(201);
    })
    .catch((dbErr) => {
      console.error(dbErr);
    })
});

// PUT route, to update status
console.log('req.params', req.params);
  const bookId = req.params.id;
  let currentStatus = req.body;
  if (currentStatus.currentStatus === 'false') {
    currentStatus = 'true';
  } else {
    currentStatus = 'false';
  }
  console.log('req.body', req.body);
  const sqlText = `
    UPDATE "books"
      SET "isRead"=$1
      WHERE "id"=$2;
  `;
  const sqlValues = [
    currentStatus,
    bookId
  ];

  pool.query(sqlText, sqlValues)
    .then((dbResult) => {
      res.sendStatus(200);
    })
    .catch((dbErr) => {
      console.error(dbErr);
      res.sendStatus(500);
    })
});


// DELETE route, to remove task
router.delete('/:id', (req, res) => {
    console.log('DELETE /tasks/:id');
    console.log('req.params:', req.params);
    const taskId = req.params.id;
    const sqlText = `
      DELETE FROM "tasks"
        WHERE "id"=$1;
    `;
    const sqlValues = [ taskId ];
  
    pool.query(sqlText, sqlValues)
      .then((dbResult) => {
        res.sendStatus(200);
      })
      .catch((dbErr) => {
        console.error(dbErr);
        res.sendStatus(500);
      })
  });

module.exports = router;