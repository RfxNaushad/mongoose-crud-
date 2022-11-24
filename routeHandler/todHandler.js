const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchemas');
const Todo = new mongoose.model("Todo", todoSchema);

// get all the todos
router.get('/', (req, res) => {
    Todo.find({ status: 'active' },).select({
        _id: 0,
        _v: 0,
        date: 0,
    })
        .limit(1)
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was server side error!",
                });
            } else {
                res.status(200).json({
                    result: data,
                    message: "Success"
                });
            }
        })
})

// get a todo by id
router.get('/:id', async (req, res) => {
    try{
        const data = await Todo.find({ _id: req.params.id })
        
        res.status(200).json({
            result: data,
            message: "Success"
        });

    } catch(err){
        res.status(500).json({
            error: "There was server side error!",
        });
    }
})

//post a todo
router.post('/', (req, res) => {
    const newTodo = new Todo(req.body);
    newTodo.save((err) => {
        if (err) {
            res.status(500).json({
                error: "There was server side error!",
            });
        } else {
            res.status(200).json({
                message: "Todo was inserted successfully"
            });
        }
    });
})

//post multiple todo
router.post('/all', (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was server side error!",
            });
        } else {
            res.status(200).json({
                message: "Todos were inserted successfully"
            });
        }
    })
})

//put todo
router.put("/:id", (req, res) => {
    const result = Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                status: "inactive",
            },
        },
        {
            new: true,
            useFindAndModify: false,
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    message: "Todo was updated successfully!",
                });
            }
        });
    console.log(result);
});

router.put('/all/:id', (req, res) => {
     Todo.updateMany({ status: "active" },
        {
            $set: {
                eligible: "true",
            },
        }, (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was server side error!",
                });
            } else {
                res.status(200).json({
                    message: "Todo was updated successfully"
                });
            }
        })
})

//delete one
router.delete('/:id',  (req, res) => {
     Todo.findByIdAndDelete({ _id: req.params.id },
        (err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was server side error!",
                });
            } else {
                res.status(200).json({
                    message: "Todo deleted successfully"
                });
            }
        });
})

//delete many
router.delete('/', (req, res) => {
    Todo.deleteMany({ status: "active" }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was server side error!",
            });
        } else {
            res.status(200).json({
                message: "Todo deleted successfully"
            });
        }
    })
})
module.exports = router;