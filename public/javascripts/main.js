$(function () {
    $(".custedit").click(function () {
        var customerID = $(this).parents('tr').attr("id")
        $.ajax({
            url: '/crud/getcustomer',
            method: "post",
            data: { id: customerID },
            success: function (res) {
                res.forEach(function (element, index) {
                    $("#name").val(element.name);
                    $("#email").val(element.email);
                    $("#phone").val(element.phone);
                    $("#adress").val(element.adress);
                    $("#id").val(element._id)

                });

            }
        });
    });


    $("#custForm").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/crud/updatecustomer",
            method: "post",
            data: $(this).serialize(),
            success: function (res, data) {
                if (res.error == false && res.msg == "success") {
                    $.ajax({
                        url: "/crud/addcustomer",
                        method: "get",
                        success: function (data) {
                            $("body").html(data);
                            alert("Successfully Updated Data.");
                        }
                    });

                    // $("#custForm").load("/crud/addcustomer");
                    //     return false;
                    // setTimeout(function(){ location.reload(); },0)
                    // window.location.reload(false);
                    // window.history.pushState('', 'New Page Title', '/crud/updatecustomer'); url upadte without refreshing

                }

            }
        })
    });


    $(".delete").click(function (e) {
        var con = confirm("Are you sure want to delete ?");
        if (con) {
            e.preventDefault();
            var id = $(this).attr("id");
            $.ajax({
                url: "/crud/delete/" + id,
                method: "get",
                success: function (res, data) {
                    if (res.error == false && res.msg == "success") {
                        $.ajax({
                            url: "/crud/addcustomer",
                            method: "get",
                            success: function (data) {
                                $("body").html(data);
                                alert("Successfully Deleted Data.");
                            }
                        });
                    }
                }
            })
        }
    });

    $(".name").keyup(function () {
        if ($(this).val().length > 10) {
            $(this).css("background-color", "red");
            $("#click").click(function () {
                console.log("type hererhdsg");
            })
        }
    })
    $('#add').click(function(){
        var a = parseInt($("#1").val());
        var b= parseInt($("#2").val());
        // var c =$("#3").val();

        var sum = a+b;
        $("#3").val(sum);

        // alert(sum);
    })
    $("#minus").click(function(){
        // var a= parseInt($("#1").val());
        // var b = parseInt($("#2").val());

        var minus = parseInt($("#1").val()) - parseInt($("#2").val());

        // var minus = a-b;
        $("#3").val(minus);

    })

    $("#b").click(function(){
        $("#hide1").fadeOut(2000).fadeIn(2000);
    })
    $("#on").click(function(){
        var val = $(this).text();
        if(val=="ON"){
            $(this).text("OFF")
            $("#hide").toggle();
        }else{
            $(this).text("ON")
            $("#hide").toggle();
        }
    })

    $("#myInput").keyup(function(){
        var value = $(this).val().toLowerCase();
        $("#hide1 tbody tr").filter(function() {
            $(this).toggle($(this).find("td:first").text().toLowerCase().indexOf(value) > -1).sort();
        });
    });
});
