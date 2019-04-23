
$(document).ready(function() {
    
    $("#articles").empty();
    $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>"
        + "<h3>Title:" + data[i].title + "</h3><br><h4>Link: " 
        + data[i].link + "</h4><br>" +
        data[i].summary + "</p>" /*+
         "<button type='submit' id='comment'>Comment</button>"*/);
    }
});

$(document).on("click", "#nytimes", function() {
    $.ajax({
        method: "GET",
        url: "/nyt"
    }).then(function(data) {
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<p data-id='" + data[i]._id + "'>"
            + "<h3>Title:" + data[i].title + "</h3><br><h4>Link: " 
            + data[i].link + "</h4><br>" +
            data[i].summary + "</p>" /*+
             "<button type='submit' id='commentBtn'>Comment</button>"*/);
        }
    });
    
    // .then(function(err, res) {
    //     if (err) {
    //         return err;
    //     }
    //     $("#articles").append(res);
    // })
});

$(document).on("click", "#onion", function() {
    $("#articles").append("Where Onion articles will go");
});

$(document).on("click", "p", function() {
    $("#comments").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        $("#comments").append("<h2>" + data.title + "</h2>");
        $("#comments").append("<input id='titleInput' name='title'>");
        $("#comments").append("<textarea id='bodyInput' name='body'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

        if(data.comment) {
            $("#titleInput").val(data.comment.title);
            $("#bodyInput").val(data.comment.body);
        }
    });
});

$(document).on("click", "#savecomment", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleInput").val(),
            body: $("#bodyInput").val()
        }
    })
    .then(function(data) {
        $("#comments").empty();
    });
    $("titleInput").val("");
    $("#bodyInput").val("");
});
});