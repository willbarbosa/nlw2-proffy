const database = require('./database/db')

const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format')
const { render } = require('nunjucks')

function pageLanding(request, response) {
    return response.render("index.html")
}

async function pageStudy(request, response) {
    const filters = request.query

    if (!filters.subject || !filters.weekday || !filters.time) {
        return response.render("study.html", { filters, subjects, weekdays })
    }

    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes
        ON ( classes.proffy_id = proffys.id )
        WHERE EXISTS (
            SELECT class_schedules.*
            FROM class_schedules
            WHERE class_schedules.class_id = classes.id
            AND class_schedules.weekday = ${ filters.weekday }
            AND class_schedules.time_from <= ${ timeToMinutes }
            AND class_schedules.time_to > ${ timeToMinutes }
        )
        AND classes.subject = '${ filters.subject }'
    `

    try {
        const db = await database
        const proffys = await db.all(query)
        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })
        
        return response.render("study.html", { proffys, filters, subjects, weekdays })
    } catch (error) {
        console.log(error)
    }
}

function pageGiveClasses(request, response) {
    return response.render("give-classes.html", { subjects, weekdays })
}

async function saveClasses(request, response) {
    const createProffy = require('./database/createProffy')

    const proffyValue = {
        name: request.body.name,
        avatar: request.body.avatar,
        whatsapp: request.body.whatsapp,
        bio: request.body.bio
    }

    const classValue = {
        subject: request.body.subject,
        cost: request.body.cost
    }

    const classScheduleValues = request.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHoursToMinutes(request.body.time_from[index]),
            time_to: convertHoursToMinutes(request.body.time_to[index])
        }
    })

    try {
        const db = await database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })

        let queryString = "?subject=" + request.body.subject
        queryString += "&weekday=" + request.body.weekday[0]
        queryString += "&time=" + request.body.time_from[0]

        return response.redirect("/success" + queryString)
    } catch (error) {
        console.log(error)
    }
}

function pageSuccess(request, response) {
    return response.render("success.html");
}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses,
    pageSuccess
}