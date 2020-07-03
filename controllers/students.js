const fs = require('fs')
const data = require('../data.json')
const { age, date, birthDate } = require('../functions')

exports.index = function(req, res) {
    return res.render('students/index', { students: data.students })
}

exports.create = function(req, res) {
    return res.render('students/create')
}

exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == '') {
            return res.send('Please, fill all the fields.')
        }
    }

    let { birth, time } = req.body

    birth = Date.parse(req.body.birth)

    let id = 1

    const lastStudent = data.students[data.students.length - 1]

    if (lastStudent) {
        id += lastStudent.id
    }

    data.students.push({
        id,
        ...req.body,
        birth,
        time
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('File writing error.')

        return res.redirect(`/students/${id}`)
    })
}

exports.show = function(req, res) {
    const { id } = req.params

    const foundStudent = data.students.find(function(student) {
        return student.id == id
    })

    if (!foundStudent) return res.render('Student not found!')

    const student = {
        ...foundStudent,
        age: age(foundStudent.birth),
        birth: date(foundStudent.birth)
    }

    return res.render('students/show', { student })
}

exports.edit = function(req, res) {
    const { id } = req.params

    const foundStudent = data.students.find(function(student) {
        return student.id == id
    })

    if (!foundStudent) return res.send('Student not found!')

    const student = {
        ...foundStudent,
        birth: birthDate(foundStudent.birth),
    }

    return res.render('students/edit', { student })
}

exports.put = function(req, res) {
    const { id } = req.body

    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex) {
        if (student.id == id) {
            index = foundIndex
            return true
        }
    })

    if (!foundStudent) {
        return res.send('Student not found!')
    }

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.students[index] = student

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('File writing error!')

        return res.redirect(`/students/${id}`)
    })
}

exports.delete = function(req, res) {
    const { id } = req.body

    const filteredStudents = data.students.filter(function(student) {
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('File writing error!')

        return res.redirect(`/students`)
    })
}