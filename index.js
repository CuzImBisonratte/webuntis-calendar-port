const config = require('./config.json');
const WebUntis = require('webuntis');
const caldav = require("node-caldav-mod");
const fs = require('fs');

// Add webuntis server url if needed
if (!config.webuntis.server.includes('.')) config.webuntis.server = config.webuntis.server + '.webuntis.com';

const untis = new WebUntis(config.webuntis.school, config.webuntis.username, config.webuntis.password, config.webuntis.server);


untis.login().then(() => {
    untis.getOwnTimetableForToday().then((timetable) => {
        let class_list = timetable;
        let class_list_edit = [];
        class_list.forEach((lesson) => {
            lesson.date = lesson.date.toString().slice(0, 4) + "-" + lesson.date.toString().slice(4, 6) + "-" + lesson.date.toString().slice(6, 8);
            if (lesson.startTime.toString().length == 3) lesson.startTime = "0" + lesson.startTime;
            if (lesson.endTime.toString().length == 3) lesson.endTime = "0" + lesson.endTime;
            lesson.startTime = lesson.startTime.toString().slice(0, 2) + ":" + lesson.startTime.toString().slice(2, 4);
            lesson.endTime = lesson.endTime.toString().slice(0, 2) + ":" + lesson.endTime.toString().slice(2, 4);
            class_list_edit.push({
                "id": lesson.id,
                "date": lesson.date,
                "startTime": lesson.startTime,
                "endTime": lesson.endTime,
                "name": lesson.su[0].longname,
                "teacher": lesson.te[0].longname,
                "room": lesson.ro[0].name
            });
        });
        class_list = class_list_edit;
        class_list_edit = [];
        class_list.sort((a, b) => {
            if (a.startTime < b.startTime) return -1;
            if (a.startTime > b.startTime) return 1;
            return 0;
        });
        for (let i = 0; i < class_list.length; i++) {
            if (class_list[i + 1] != undefined) {
                if (class_list[i].name == class_list[i + 1].name && class_list[i].teacher == class_list[i + 1].teacher && class_list[i].room == class_list[i + 1].room) {
                    class_list[i].endTime = class_list[i + 1].endTime;
                    class_list.splice(i + 1, 1);
                    i--;
                }
            }
        }
        class_list.forEach((lesson) => {
            class_list_edit.push({
                "id": lesson.id,
                "date": lesson.date,
                "startTime": lesson.startTime,
                "endTime": lesson.endTime,
                "name": lesson.name,
                "teacher": lesson.teacher,
                "room": lesson.room
            });
        });
        class_list = class_list_edit;
        class_list_edit = [];
    });
});