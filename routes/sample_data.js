var express = require("express");

var router = express.Router();

var database = require('../database');

router.get("/", function (request, response, next) {
    var query = "SELECT * FROM mydb.SINHVIEN;"
    database.query(query, function (error, data) {

        if (error) {
            throw error;
        }
        else {
            response.render(
                'sample_data',
                {
                    title: 'Danh sách sinh viên',
                    action: 'list',
                    sampleData: data
                }
            );
        }
    })
})

router.get("/addStudent", function (request, response, next) {
    response.render('addStudent');


})

router.post("/addStudent", function (request, response, next) {
    var name = request.body.name;
    var msv = request.body.MSV;
    var ns = request.body.ngaySinh;
    var dateParts = ns.split("-");
    var ngaySinh = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

    if (ngaySinh.length > 10) {
        ngaySinh = "0/0/0000";
    }

    var query = `
	INSERT IGNORE into SINHVIEN(MSV,tenSinhVien,ngaySinh) 
	VALUES ("${msv}", "${name}", "${ngaySinh}")
	`;


    database.query(query, function (error, data) {

        if (error) {
            throw error;
        }
        else {
            response.redirect("/sample_data");
        }

    });
})

router.get('/edit/:MSV', function (request, response, next) {

    console.log(request.params);

    var MSV = request.params.MSV;

    var query = `SELECT * FROM SINHVIEN WHERE MSV = "${MSV}"`;

    database.query(query, function (error, data) {

        response.render('editStudent', { title: 'Edit MySQL Table Data', action: 'edit', data: data });

    });

});

router.post('/edit/:MSV', function (request, response, next) {
    var MSV = request.params.MSV;

    var name = request.body.name;
    var msv = request.body.MSV;
    var ns = request.body.ngaySinh;
    var dateParts = ns.split("-");
    var ngaySinh = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
    if (ngaySinh.length > 10) {
        ngaySinh = "0/0/0000";
    }

    var query = `
	UPDATE SINHVIEN set 
    tenSinhVien = "${name}",
    ngaySinh = "${ngaySinh}"
    where msv =  "${msv}"
	`;

    database.query(query, function (error, data) {

        if (error) {
            throw error;
        }
        else {
            response.redirect('/sample_data');
        }

    });

})

router.get('/addClass', function (request, response, next) {
    response.render('addClass');
})

router.post('/addClass', function (request, response, next) {
    var msv = request.body.msv;
    var maLop = request.body.maLop;
    var maMonHoc = maLop.split(' ')[0];

    var query = `
	INSERT ignore INTO SINHVIEN_hoc_LOPHOC(SINHVIEN_MSV, LOPHOC_maLop
        , LOPHOC_MONHOC_maMonHoc) VALUES ("${msv}", "${maLop}", "${maMonHoc}")
	`;

    database.query(query, function (error, data) {

        if (error) {
            throw error;
        }
        else {
            response.redirect("/sample_data");
        }

    });
})

router.get('/addTeacher', function (request, response, next) {
    response.render('addTeacher');
})

router.post('/addTeacher', function (request, response, next) {
    var giangvien = request.body.giangVien;
    var maLop = request.body.maLop;
    var maMonHoc = maLop.split(' ')[0];

    console.log(maLop);

    // var query2 = `
    // INSERT ignore INTO GIANGVIEN_day_LOPHOC(GIANGVIEN_tenGiangVien, LOPHOC_maLop
    //     , LOPHOC_MONHOC_maMonHoc) VALUES ("${giangvien}", "${maLop}", "${maMonHoc}")`;

    var query = `INSERT ignore INTO GIANGVIEN(tenGiangVien) VALUES("${giangvien}");
        INSERT ignore INTO GIANGVIEN_day_LOPHOC(GIANGVIEN_tenGiangVien, LOPHOC_maLop
        , LOPHOC_MONHOC_maMonHoc) VALUES ("${giangvien}", "${maLop}", "${maMonHoc}");`;

    database.query(query, function (error, data) {

        if (error) {
            throw error;
        }

    });

    // database.query(query2, function (error, data) {

    //     if (error) {
    //         throw error;
    //     }
    // });
})

router.get('/delete/:MSV', function (request, response, next) {
    var MSV = request.params.MSV;


    var query = `delete from SINHVIEN_hoc_LOPHOC where SINHVIEN_MSV = 
                "${MSV}";
                delete from SINHVIEN where (MSV = "${MSV}");`;

    database.query(query, function (error, data) {

        if (error) {
            throw error;
        }
        else {
            response.redirect('/sample_data');
        }

    });

})

router.get('/searchClass', function (request, response, next){
    response.render('searchClass');
})

router.post('/searchClass', function (request, response, next) {

    var maLop = request.body.maLop;

    var query = `SELECT * FROM LOPHOC l inner join MONHOC m on (l.MONHOC_maMonHoc = 
        m.maMonHoc)  inner join SINHVIEN_hoc_LOPHOC h on(h.LOPHOC_maLop=l.maLop) 
        inner join GIANGVIEN_day_LOPHOC gv on (gv.LOPHOC_maLop = l.maLop)
        inner join SINHVIEN sv on (sv.MSV=h.SINHVIEN_MSV) 
        WHERE maLop ="${maLop}";`;

    database.query(query, function (error, data) {

        response.render('studentList',{ title: 'Edit MySQL Table Data', action: 'edit', sampleData: data })

    });

});

module.exports = router;