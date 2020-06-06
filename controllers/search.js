const BTech = require("../models/BTech");
const MTech = require("../models/MTech");

exports.querySearch = async (req, res) => {
    const query = req.query;
    var selections = "Name City State Course Department House Sex Clubs";
    var options = {
        skip: parseInt(req.query.skip),
        limit: parseInt(req.query.limit)
    };

    var searchableObject = {};

    if(query.name) {
        searchableObject["Name"] = {
            $regex: new RegExp (query.name.toString().toLowerCase()),
            $options: 'i'
        };
	}
	
	if(query.admno) {
        searchableObject["Admission No"] = {
            $regex: new RegExp (query["admno"].toString().toLowerCase()),
            $options: 'i'
        };
	}
	
	if(query.city) {
        searchableObject["City"] = {
            $regex: new RegExp (query.city.toString().toLowerCase()),
            $options: 'i'
        };
    }

    if(query.state) {
        searchableObject["State"] = {
            $regex: new RegExp (query.state.toString().toLowerCase()),
            $options: 'i'
        };
    }

    if (query.sex) {
        searchableObject.Sex = {
            $regex: new RegExp (query.sex.toString().toLowerCase()),
            $options: 'i'
        };
	}
	
	if (query.house) {
        searchableObject.House = {
            $regex: new RegExp (query.house.toString().toLowerCase()),
            $options: 'i'
        };
    }

    if(query.department) {
        searchableObject.Department = {
            $regex: new RegExp (query.department.toString().toLowerCase()),
            $options: 'i'
        };
    }

    if(query.intern) {
        searchableObject.Internship = {
            $regex: new RegExp (query.intern.toString().toLowerCase()),
            $options: 'i'
        };
    }

    var students = [];

    try {
        let _queryTime = Date.now();
        if ((query.course === "btech")) {
            students = await BTech.find(searchableObject, selections, options);
        } else if (query.course === "mtech") {
            students = await MTech.find(searchableObject, selections, options);
        } else {
            const btech = await BTech.find(searchableObject, selections, {
                skip: Math.floor(parseInt(req.query.skip)/2),
                limit: Math.floor(parseInt(req.query.limit)/2)
            });

            const mtech = await MTech.find(searchableObject, selections, {
                skip: Math.floor(parseInt(req.query.skip)/2),
                limit: Math.floor(parseInt(req.query.limit)/2)
            });

            students = [ ...btech, ...mtech ];
        }

        _queryTime = Date.now() - _queryTime - 50;
        console.log(`${students.length} ${students.length > 1 ? 'results' : 'result'} in ${_queryTime/1000} second.`);

        res.json({ "count": students.length, students, _queryTime });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ "msg": e });
    }
}

exports.findByQuery = async function (req, res) {
    let regex = new RegExp (req.params.query);
    var results = [];
    var fields = { 
        $or: [ 
                { Name: { $regex: regex, $options: "i" } },
                { "Admission No": { $regex: regex, $options: "i" } },
                { Department: { $regex: regex, $options: "i" } },
                { City: { $regex: regex, $options: "i" } },
                { State: { $regex: regex, $options: "i" } }, 
                { Sex: { $regex: regex, $options: "i" } }, 
                { House: { $regex: regex, $options: "i" } }
            ] 
    };
    var selections = "Name City State Course Department House Sex";
    var options = {
        skip: parseInt(req.query.skip),
        limit: parseInt(req.query.limit)
    };

    try {
        let _queryTime = Date.now();
        if (req.query.course === "btech") {
            const btech = await BTech.find(fields, selections, options);
            results = [...btech];
        } else if (req.query.course === "mtech") {
            const mtech = await MTech.find(fields, selections, options);
            results = [...mtech];
        } else {
            // limit: 10 will deliver 10 documents, 5 each from BTech and MTech.
            const btech = await BTech.find(fields, selections, {
                skip: Math.floor(parseInt(req.query.skip)/2),
                limit: Math.floor(parseInt(req.query.limit)/2)
            });
            const mtech = await MTech.find(fields, selections, {
                skip: Math.floor(parseInt(req.query.skip)/2),
                limit: Math.floor(parseInt(req.query.limit)/2)
            });
            results = [...btech, ...mtech];
        }
        _queryTime = Date.now() - _queryTime - 50;
        console.log(`${results.length} ${results.length > 1 ? 'results' : 'result'} in ${_queryTime/1000} second.`);

        res.json({ count: results.length, results, _queryTime });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ "msg": e });
    }
}