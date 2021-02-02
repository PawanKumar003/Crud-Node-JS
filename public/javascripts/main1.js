$(function(){
    $(".custedit1").click(function(){
        var customerID1 = $(this).parents("tr").attr("id");
        $.ajax({
            url: "/waveites/getcustomers",
            method: "post",
            data: {id: customerID1},
            success:function(res){
                res.forEach(function(element, index){
                    $("#name1").val(element.name);
                    $("#email1").val(element.email);
                    $("#phone1").val(element.phone);
                    $("#id").val(customerID1);
                });
            }
        });
    });
    $("#custForma").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/waveites/upcustomer",
            method: "post",
            data: $(this).serialize(),
            success: function (res, data) {
                if (res.error == false && res.msg == "success") {
                    $.ajax({
                        url: "/waveites/customer",
                        method: "get",
                        success: function (data) {
                            $("body").html(data);
                            alert("Successfully Updated Data.");
                            // req.flash('success', data.name + ' User Details Successfully Added.');
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

    $(".delete1").click(function(e){
        var deleteData =confirm("Are you sure you want to delete data")
        if(deleteData){
            e.preventDefault();
            var id = $(this).attr("id");
            $.ajax({
                url: "/waveites/delete/" +id,
                method: "get" ,
                success:function(res,data){
                    if(res.error==false && res.msg =="success"){
                        $.ajax({
                            url: "/waveites/customer",
                            method: "get",
                            success:function(data){
                                $("body").html(data);
                                // alert("Your Data delete successfully");
                            }
                        })
                    }
                }
            })
        }
    })
    $("#mybutton").click(function(){
        var value = $("#myinput").val().toLowerCase();
        $("#hide1 tbody tr").filter(function(){
            $(this).toggle($(this).find("td:first").text().toLowerCase().indexOf(value)>-1).sort();
        })        
    })

    $(setInterval(() => {
        $.ajax({
            url: "/waveites/getapi",
            method: "get",
            success:function(res,data){
                // console.log(data);
                
                $("#time").html();
            }
        }) 
    }, 1000));

    $("#mybtn").click(function(){
        var name = $("#input").val()
        $("#imgchange").attr("src",`https://joeschmoe.io/api/v1/ ${name}`)
    })
});