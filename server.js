/*=====================================================
Setup crap
=======================================================*/
var bodyParser = require('body-parser')
var express = require('express')
var app = express()

var request = require('request')
var mongoose = require('mongoose')
var Book = require("./models/BookModel")
var Person = require("./models/PersonModel")

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/mongooseexs")
    .then(() => console.log('Mongo DB connection successful'))
    .catch((err) => console.error(err));


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    /*=====================================================
    =======================================================*/

/*=====================================================
Create books Collection
=======================================================*/
var isbns = [9780156012195, 9780743273565, 9780435905484, 9780140275360, 9780756404741, 9780756407919, 9780140177398, 9780316769488, 9780062225672, 9780143130154, 9780307455925, 9781501143519]
var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:"

for (i in isbns) {
    var apiURL = url + isbns[i]
        //loadFromAPI(apiURL) //really, you should only run this once. that said, there's a failsafe to avoid duplicates below

}

function loadFromAPI(apiURL) {

    request(apiURL, function(error, response, body) {

        var result = JSON.parse(body)

        if (result.totalItems && !error && response.statusCode == 200) {

            var resBook = result.items[0].volumeInfo

            var book = new Book({
                title: resBook.title,
                author: resBook.authors[0],
                pages: resBook.pageCount,
                genres: resBook.categories || ["Other"],
                rating: resBook.averageRating || 5
            })

            //Only save if the book doesn't exist yet
            Book.findOne({ title: book.title }, function(err, foundBook) {
                if (!foundBook) {
                    book.save()
                }
            })
        }
    })
}
/*=====================================================
=======================================================*/

/*=====================================================
Create People Collection
=======================================================*/
var colors = ["brown", "black", "red", "yellow", "green", "grey"]
var getColor = function() {
    return colors[Math.floor(Math.random() * colors.length)]
}
var getWeight = function() {
    return getRandIntBetween(50, 120)
}
var getHeight = function() {
    return getRandIntBetween(120, 230)
}
var getSalary = function() {
    return getRandIntBetween(20000, 50000)
}
var getNumKids = function() {
    return Math.floor(Math.random() * 3)
}

var getRandIntBetween = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var getKids = function(numKids) {
    var kids = [];
    for (var i = 0; i < numKids; i++) {
        kids.push({
            hair: getColor(),
            eyes: getColor(),
            weight: getWeight(),
            height: getHeight(),
        })
    }
    return kids;
}

Person.find({}).count(function(err, count) {

        if (count < 100) {
            for (var i = 0; i < 100 - count; i++) {

                var numKids = getNumKids();
                var p = new Person({
                    hair: getColor(),
                    eyes: getColor(),
                    weight: getWeight(),
                    height: getHeight(),
                    salary: getSalary(),
                    numKids: numKids,
                    kids: getKids(numKids)
                })

                p.save()
            }
        }
    })
    /*=====================================================
    =======================================================*/

/*=====================================================
Exercises
=======================================================*/
/*Books
----------------------*/
//1. Find books with fewer than 500 but more than 200 pages

// Book.find({ pages: { $gt: 200, $lt: 500 } })
//     .then(function(success) {
//         console.log(success);
//     })
//     .catch(function(err) {
//         console.log(err);
//     })

// Book.find({}).where('pages').gt(200).lt(500).exec(function(err, data) {
//     console.log(data);
// })


//2. Find books whose rating is less than 5, and sort by the author's name

// Book.aggregate(
//     [{
//         $match: {
//             rating: { $lt: 5 }
//         }
//     }, {
//         $sort: { author: 1 }
//     }],
//     function(error, success) {
//         console.log(success);
//     }
// )

// Book.find({}).where('rating').lt(5).sort({ author: 1 }).exec(function(err, data) {
//     console.log(data);
// })




//3. Find all the cooks containing "Fiction", skip the first 2, and display only 3 of them 

// Book.aggregate(
//     [{
//         $match: {
//             genres: /Fiction/
//         }
//     }, {
//         $skip: 2
//     }, {
//         $limit: 3
//     }],
//     function(error, success) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(success);
//         }
//     }
// )


// Book.find({ genres: /Fiction/ }).skip(2).limit(3).exec(function(err, data) {
//     console.log(data);
// })



/*People
----------------------*/
//1. Find all the people who are tall (>180) AND rich (>30000)

// Person.find({
//         height: {
//             $gt: 200
//         },
//         salary: {
//             $gt: 30000
//         }
//     })
//     .then(function(success) {
//         console.log(success);
//     })
//     .catch(function(err) {
//         console.log(err);
//     })

// Person.find({}).where('height').gt(180).where('salary').gt(30000).exec(function(err, data) {
//     console.log(data);
// })

//2. Find all the people who are tall (>180) OR rich (>30000)

// Person.find({
//         "$or": [{
//             height: {
//                 $gt: 180
//             }
//         }, {
//             salary: {
//                 $gt: 90000
//             }
//         }]
//     })
//     .then(function(success) {
//         console.log(success);
//     })
//     .catch(function(err) {
//         console.log(err);
//     })

// Person.find({}).or([{ height: { $gt: 180 } }, { salary: { $gt: 49000 } }]).exec(function(err, data) {
//     console.log(data);
// })

//3. Find all the people who have grey eyes or hair, and are skinny (<70)

// Person.find({
//         "$or": [{
//             eyes: /grey/
//         }, {
//             hair: /grey/
//         }],
//         weight: {
//             $lt: 70
//         }
//     })
//     .then(function(success) {
//         console.log(success);
//     })
//     .catch(function(err) {
//         console.log(err);
//     })

// Person.find({}).or([{ eyes: /grey/ }, { hair: /grey/ }])
//     .where('weight')
//     .lt(70)
//     .exec(function(err, data) {
//         console.log(data);
//     })


//4. Find people who have at least 1 kid and grey eyes

// Person.find({
//         eyes: /grey/,
//         numKids: {
//             $gte: 1
//         }
//     })
//     .then(function(success) {
//         console.log(success);
//     })
//     .catch(function(err) {
//         console.log(err);
//     })

// Person.find({ eyes: /grey/ }).where('numKids').gte(1).exec(function(err, data) {
//     console.log(data);
// })

//5. Find all the people who have at least one overweight kid, 
//   and are overweight themselves (>100)


// Person.find({
//         kids: {
//             $elemMatch: {
//                 weight: {
//                     $gte: 100
//                 }
//             }
//         },
//         weight: {
//             $gte: 100
//         }
//     })
//     .then(function(success) {
//         success.forEach(function(result) {
//             console.log("---");
//             console.log(result.weight);
//             result.kids.forEach(function(kid) {
//                 console.log(kid.weight);
//             })
//         })
//     })
//     .catch(function(err) {
//         console.log(err);
//     })


// Person.find({ kids: { $elemMatch: { weight: { $gte: 100 } } } })
//     .where('weight')
//     .gte(100)
//     .exec(function(err, data) {
//         data.forEach(function(result) {
//             console.log("---");
//             console.log(result.weight);
//             result.kids.forEach(function(kid) {
//                 console.log(kid.weight);
//             })
//         })
//     })

/*=====================================================
=======================================================*/

app.listen(1337, function() {
    console.log("Server up and running ~")
})
