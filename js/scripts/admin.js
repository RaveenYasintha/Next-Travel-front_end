// Read the CSS parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const cssParam = urlParams.get("section");
if (cssParam) {
    showSectionOnLoad(cssParam);
}

function showSectionOnLoad(section) {
    // Hide all sections
    const sections = ['driver', 'travel-package', 'hotel', 'vehicle', 'user', 'super'];
    if (section !== 'super') {
        sections.forEach(s => {
            const element = document.getElementById(s);
            const menuItems = document.getElementById(s + 'Btn');
            if (element) {
                element.classList.add('hide');
                menuItems.classList.add('hide');
            }
        });

        // Show the selected section
        const selectedSection = document.getElementById(section);
        const selectedButton = document.getElementById(section + 'Btn');
        if (selectedSection) {
            selectedSection.classList.remove('hide');
            selectedButton.classList.remove('hide');
        }
    } else {
        const menuItems = document.getElementById('driver');
        menuItems.classList.remove('hide');
    }

}

function showSectionOnClick(section) {
    // Hide all sections
    const sections = ['driver', 'travel-package', 'hotel', 'vehicle', 'user', 'super','guide'];
    if (section !== 'super') {
        sections.forEach(s => {
            const element = document.getElementById(s);
            const menuItems = document.getElementById(s + 'Btn');
            if (element) {
                element.classList.add('hide');
            }
        });

        // Show the selected section
        const selectedSection = document.getElementById(section);
        const selectedButton = document.getElementById(section + 'Btn');
        if (selectedSection) {
            selectedSection.classList.remove('hide');
        }
    }

}

$("#logoutButton").on("click", function () {
    window.location.href = "index.html";
});


let baseURL = "http://localhost:8080/";
let baseURL2 = "http://localhost:8081/";

/////Driver

bindRowClickEventsDriver();

$("#btnAddDriver").on("click", function () {

    let file = $("#dr_frontPhoto")[0].files[0];
    let fileName = $("#dr_frontPhoto")[0].files[0].name;

    let driverFormData = new FormData();
    driverFormData.append("name", $("#driver_name").val());
    driverFormData.append("email", $("#driver_email").val());
    driverFormData.append("contactNum", $("#driver_contact").val());
    driverFormData.append("nic", $("#driver_lic").val());
    driverFormData.append("address", $("#driver_address").val());
    driverFormData.append("status", "Available");
    driverFormData.append("imgFile", file, fileName);



    $.ajax({
        type: "POST", // You might need to adjust this depending on your server's API.
        url: baseURL + "driver/add_driver",
        data: driverFormData,
        dataType: "json",
        async: true,
        contentType: false,
        processData: false,
        enctype: "multipart/form-data",
        success: function (response) {
            alert("Driver added successfully:");
            document.getElementById('driverForm').reset();
            loadAllDriver();
        },
        error: function (error) {
            console.error("Error adding driver:", error);
        }
    });
});

loadAllDriver();

function loadAllDriver() {
    $("#driverTable").empty();
    $.ajax({
        url: baseURL + "driver/fetch_driver", dataType: "json", success: function (resp) {
            for (let dri of resp) {
                var row = '<tr><td>' + dri.id + '</td><td>' + dri.name + '</td>><td>' + dri.nic + '</td><td>' + dri.contactNum + '</td><td>' + dri.email + '</td><td>' + dri.address + '</td><td>' + dri.status + '</td><td><a data-bs-toggle="modal" data-bs-target="#exampleModal1"\n' +
                    '                                                                                                                                                                                                                  class="text-primary font-monospace" style="cursor: pointer">View</a></td></tr>';
                $("#driverTable").append(row);
            }
            bindRowClickEventsDriver();
        }

    });
}

var driverId;

function bindRowClickEventsDriver() {
    $("#driverTable>tr").click(function () {
        driverId = parseInt($(this).find("td:eq(0)").text());
        let drName = $(this).find("td:eq(1)").text();
        let drLic = $(this).find("td:eq(2)").text();
        let drContact = $(this).find("td:eq(3)").text();
        let drEmail = $(this).find("td:eq(4)").text();
        let drAddress = $(this).find("td:eq(5)").text();

        $('#driver_lic').val(drLic);
        $('#driver_name').val(drName);
        $('#driver_contact').val(drContact);
        $('#driver_email').val(drEmail);
        $('#driver_address').val(drAddress);
        // $("#dr_visuable").val(driverId);

        $.ajax({
            url: baseURL + "driver/search_driver?driverId=" + driverId,
            method: "get",
            success: function (resp) {
                $('#driverLicenceImg').empty();
                let driverName = resp.data.name;
                let email = resp.data.email;
                let driverNic = resp.data.nic;
                let driverContactNumber = resp.data.contactNum;
                let driverAddress= resp.data.address;
                document.getElementById('driverLicenceImg').src = baseURL + resp.data.drivingLicenseImg;
               // $("#popUpDriverName").val(resp.data.name)
                document.getElementById('popUpDriverName').innerHTML
                    = driverName;

                document.getElementById('popUpDriverEmail').innerHTML
                    = email;

                document.getElementById('popUpDriverNic').innerHTML
                    = driverNic;

                document.getElementById('popUpDriverContact').innerHTML
                    = driverContactNumber;

                document.getElementById('popUpDriverAddress').innerHTML
                    = driverAddress;

              //  $("#popUpDriverNic").val(resp.data.nic);
              //  $("#popUpDriverEmail").val(resp.data.email)
                $("#popUpDriverContact").val(resp.data.contactNum)
                $("#popUpDriverAddress").val(resp.data.address)
            }
        });
    });

}


$("#btnUpdateDriver").click(function () {
    let nic = $("#driver_lic").val();
    let name = $("#driver_name").val();
    let address = $("#driver_address").val();
    let contactNum = $("#driver_contact").val();
    let email = $("#driver_email").val();

    var driver = {
        id: driverId,
        name: name,
        email: email,
        nic: nic,
        contactNum:
        contactNum,
        address: address,
    }

    $.ajax({
        type: "POST",
        url: baseURL + "driver/update_driver",
        data: JSON.stringify(driver),
        contentType: "application/json",
        success: function (response) {
            loadAllDriver();
            alert("Driver Updated successfully:");
            document.getElementById('driverForm').reset();
        },
        error: function (error) {
            console.error("Error adding driver:", error);
        }
    });
    loadAllDriver();
});

$("#btnDeleteDriver").click(function () {

    $.ajax({
        url: baseURL + "driver/delete_driver?id=" + driverId + "", method: "delete", success: function (resp) {
            loadAllDriver();
            alert(resp.message);
        }, error: function (error) {
            alert(JSON.parse(error.responseText).message);
        }
    });
});
$("#btnClearDriver").click(function (){
    document.getElementById('driverForm').reset();
})

///////// Hotel

loadAllHotel();
binRaw();

$("#btnAddHotel").click(function () {
    let name = $("#hotelName").val();
    let hotelCategory = $("#categorySelected").val();
    let location = $("#location").val();
    let googleMapCoordinates = $("#googleMapCoordinates").val();
    let hotelEmail = $("#hotelEmail").val();
    let hotelContact = $("#hotelContact").val();
    let hotelFee = $("#hotel_fee").val();
    let starRate =$("#starRate").val();

    var hotel = {
        name: name,
        hotelCategory: hotelCategory,
        location: location,
        googleMapCoordinates: googleMapCoordinates,
        email: hotelEmail,
        contact: hotelContact,
        hotelFee: hotelFee,
        starRate:starRate
    }
    $.ajax({
        type: "POST", // You might need to adjust this depending on your server's API.
        url: baseURL + "hotel/add_hotel",
        data: JSON.stringify(hotel),
        contentType: "application/json",
        success: function (response) {
            alert("Hotel added successfully:");
            loadAllHotel();
            document.getElementById('hotelForm').reset();
        },
        error: function (error) {
            console.error("Error adding Hotel:", error);
        }
    });

})

function loadAllHotel() {
    $("#hotelTable").empty();
    $.ajax({
        url: baseURL + "hotel/view_all", dataType: "json", success: function (resp) {
            for (let dri of resp.data) {
                var row = '<tr><td>' + dri.id + '</td><td>' + dri.name + '</td><td>' + dri.email + '</td><td>' + dri.location + '</td><td><a data-bs-toggle="modal" data-bs-target="#exampleModal3"\n' +
                    '                                                                                                                                                                                                                  class="text-primary font-monospace" style="cursor: pointer">View</a></td></tr>';
                $("#hotelTable").append(row);
            }
            binRaw();
            //bindRowClickEventsDriver();
        }

    });
}

var hotelId;

function binRaw() {
    $("#hotelTable>tr").click(function () {
        hotelId = $(this).find("td:eq(0)").text();

        $.ajax({
            url: baseURL + "hotel/search?id=" + hotelId + "",
            method: "GET",
            success: function (resp) {
                $('#hotelName').val(resp.data.name);//         $('#categorySelected').val(resp.data.hotelCategory);
                $('#hotelEmail').val(resp.data.email);
                $('#location').val(resp.data.location);
                $('#googleMapCoordinates').val(resp.data.googleMapCoordinates);
                $("#hotel_fee").val(resp.data.hotelFee);

                document.getElementById('popHotelName').innerHTML
                    = resp.data.name;
                document.getElementById('popHotelEmail').innerHTML
                    = resp.data.email;
                document.getElementById('popHotelLoaction').innerHTML
                    = resp.data.location;
                document.getElementById('popHotelFee').innerHTML
                    = resp.data.hotelFee;
            },
            error: function (error) {
                // alert(JSON.parse(error.responseText).message);
            }
        });

        let drName = $(this).find("td:eq(1)").text();
        let category = $(this).find("td:eq(2)").text();
        let contact = $(this).find("td:eq(3)").text();
        let location = $(this).find("td:eq(4)").text();

        //console.log(drName, drAddress, drEmail, drContact, drLic);

        $('#dr_lic').val(drName);
        $('#dr_name').val(category);
        $('#dr_contact').val(contact);
        $('#dr_email').val(location);
        $('#dr_address').val(drAddress);


    });

}

$("#btnUpdateHotel").click(function () {
    console.log(hotelId);
    let name = $("#hotelName").val();
    let hotelCategory = $("#categorySelected").val();
    let location = $("#location").val();
    let googleMapCoordinates = $("#googleMapCoordinates").val();
    let hotelEmail = $("#hotelEmail").val();
    let hotelContact = $("#hotelContact").val();
    let hotelFee = $("#hotel_fee").val();
    var hotel = {
        id: hotelId,
        name: name,
        hotelCategory: hotelCategory,
        location: location,
        googleMapCoordinates: googleMapCoordinates,
        email: hotelEmail,
        contact: hotelContact,
        hotelFee: hotelFee,
    }
    $.ajax({
        type: "PUT", // You might need to adjust this depending on your server's API.
        url: baseURL + "hotel/update_hotel",
        data: JSON.stringify(hotel),
        contentType: "application/json",
        success: function (response) {
            alert("Hotel Updated successfully:");
            loadAllHotel();
            document.getElementById('hotelForm').reset();
        },
        error: function (error) {
            console.error("Error Updaated Hotel:", error);
        }
    });

})

$("#btnDeleteHotel").click(function () {
    $.ajax({
        url: baseURL + "hotel/delete_hotel?hotelId=" + hotelId,
        method: "DELETE",
        dataType: "json",
        success: function (resp) {
            alert("Hotel Removed successfully");
            loadAllHotel();
            document.getElementById('hotelForm').reset();
        },
        error: function (error) {
            alert(JSON.parse(error.responseText).message);
        }
    });
    loadAllHotel();
})
$("#btnClearHotel").click(function (){
    document.getElementById('hotelForm').reset();
})

///////// Travel

loadAllPackages();

$("#btnAddTravel").click(function () {
    let packageName = $("#tr_name").val();
    let packageCategory = $("#travel_category").val();
    let starRate = $("#star_rate").val();
    let description = $("#travel_description").val();
    let headCount = $("#travel_count").val();
    let travelDuration = $("#travelDuration").val();
    let travel = {
        packageName: packageName,
        packageCategory: packageCategory,
        starRate: starRate,
        description: description,
        headCount: headCount,
        travelDuration: travelDuration,
    }
    $.ajax({
        type: "POST",
        url: baseURL + "packages/add_package",
        data: JSON.stringify(travel),
        contentType: "application/json",
        success: function (response) {
            loadAllPackages();
            document.getElementById('travelForm').reset();
        },
        error: function (error) {
            console.error("Error adding Travel:", error);
        }
    });
})

function loadAllPackages() {
    $("#travelTable").empty();
    $.ajax({
        url: baseURL + "packages/get_packages", dataType: "json", success: function (resp) {
            for (let dri of resp.data) {
                var row = '<tr><td>' + dri.id + '</td><td>' + dri.packageName + '</td>><td>' + dri.packageCategory + '</td><td>' + dri.starRate + '</td><td>' + dri.headCount + '</td><td>' + dri.description + '</td><td><a data-bs-toggle="modal" data-bs-target="#exampleModal2"\n' +
                    '                                                                                                                                                                                                                  class="text-primary font-monospace " style="cursor: pointer">View</a></td></tr>';
                $("#travelTable").append(row);
            }
            bindRawPackages();
        }

    });
}

var packageId;

function bindRawPackages() {
    $("#travelTable>tr").click(function () {
        packageId = parseInt($(this).find("td:eq(0)").text());
        let packageName = $(this).find("td:eq(1)").text();
        let category = $(this).find("td:eq(2)").text();
        let starRate = $(this).find("td:eq(3)").text();
        let headCount = $(this).find("td:eq(4)").text();
        // let duration = $(this).find("td:eq(5)").text();
        let description = $(this).find("td:eq(6)").text();

        $('#tr_name').val(packageName);
        $('#travel_category').val(category);
        $('#star_rate').val(starRate);
        $('#travel_count').val(headCount);
        // $('#travelDuration').val(duration);
        $("#travel_description").val(description);


        $.ajax({
            url: baseURL + "packages/get_package?id=" + packageId + "", method: "get", success: function (resp) {
                let packageName = resp.data.packageName;
                let packageCategory = resp.data.packageCategory;
                let packageStarRate = resp.data.starRate;
                let packagHeadCount = resp.data.headCount;
                let decriptiom = resp.data.description;


                document.getElementById('popUpPackageName').innerHTML
                    = packageName;

                document.getElementById('popUpTravelCategory').innerHTML
                    = packageCategory;
                document.getElementById('popPacakageStarRate').innerHTML
                    = packageStarRate;
                document.getElementById('popTravelCount').innerHTML
                    = packagHeadCount;
                document.getElementById('popTravelDuration').innerHTML
                    = decriptiom;
                // $("#popUpPackageName").val(resp.data.packageName)
                // $("#popUpTravelCategory").val(resp.data.packageCategory);
                // $("#popPacakageStarRate").val(resp.data.starRate+" "+"Star")
                // $("#popTravelCount").val(resp.data.headCount)
                // $("#popTravelDuration").val(resp.data.travelDuration+" "+"Days")
            }, error: function (error) {

            }
        });

    });
}

$("#btnUpdateTravel").click(function () {
    let packageName = $("#tr_name").val();
    let packageCategory = $("#travel_category").val();
    let starRate = $("#star_rate").val();
    let description = $("#travel_description").val();
    let headCount = $("#travel_count").val();
    let travelDuration = $("#duration").val();
    let travel = {
        id: packageId,
        packageName: packageName,
        packageCategory: packageCategory,
        starRate: starRate,
        description: description,
        headCount: headCount,
        travelDuration: travelDuration,
    }
    $.ajax({
        type: "PUT", // You might need to adjust this depending on your server's API.
        url: baseURL + "packages/update_package",
        data: JSON.stringify(travel),
        contentType: "application/json",
        success: function (response) {
            alert("Travel Package Updated successfully:");
            loadAllPackages();
            document.getElementById('travelForm').reset();
        },
        error: function (error) {
            console.error("Error Updated Travel:", error);
        }
    });
})

$("#btnDeleteTravel").click(function () {
    $.ajax({
        url: baseURL + "packages/delete_package?id=" + packageId + "", method: "delete", success: function (resp) {
            loadAllPackages();
            alert("Travel Package Deleted successfully:");
            document.getElementById('travelForm').reset();
        }, error: function (error) {
            alert(JSON.parse(error.responseText).message);
        }
    });
})
$("#btnClearTravel").click(function (){
    document.getElementById('travelForm').reset();
})
/////// User

loadALLUser();

function saveUser() {
    let name = $("#Full_name").val();
    let email = $("#email").val();
    let address = $("#address").val();
    let userName = $("#userName").val();
    let password = $("#password").val();
    let role = $("#selctedRole").val();
    let nicOrPassportNum = $("#nic").val();
    let user = {
        name: name,
        email: email,
        address: address,
        userName: userName,
        password: password,
        role: role,
        nicOrPassportNum: nicOrPassportNum

    }

    $.ajax({
        type: "POST", // You might need to adjust this depending on your server's API.
        url: baseURL2 + "user/add_user",
        data: JSON.stringify(user),
        contentType: "application/json",
        success: function (response) {
            alert("Travel User added successfully:");
            loadALLUser();
            document.getElementById('userForm').reset();
        },
        error: function (error) {
            console.error("Error adding User:", error);
        }
    });


}

function loadALLUser() {


    $.ajax({
        url: baseURL2 + "user",method: "get", dataType: "json", success: function (resp) {
            console.log(resp)
            for (let dri of resp) {
                var row = '<tr><td>' + dri.id + '</td><td>' + dri.name + '</td>><td>' + dri.email + '</td><td>' + dri.address + '</td><td>' + dri.userName + '</td><td>' + dri.password + '</td><td>' + dri.role + '</td><td>' + dri.nicOrPassportNum + '</td><td><a data-bs-toggle="modal" data-bs-target="#exampleModal5"\n' +
                    '                                                                                                                                                                                                                  class="btn-primary font-monospace" style="cursor: pointer">View</a></td></tr>';

                $("#userTable").append(row);
            }
            bindRawEvent();
        }

    });
}

var UserId;

function bindRawEvent() {
    $("#userTable>tr").click(function () {
        UserId = $(this).find("td:eq(0)").text();
        let fullName = $(this).find("td:eq(1)").text();
        let email = $(this).find("td:eq(2)").text();
        let address = $(this).find("td:eq(3)").text();
        let userName = $(this).find("td:eq(4)").text();
        let password = $(this).find("td:eq(5)").text();
        let role = $(this).find("td:eq(6)").text();
        let nic = $(this).find("td:eq(7)").text();


        $('#Full_name').val(fullName);
        $('#email').val(email);
        $('#address').val(address);
        $('#userName').val(userName);
        $('#password').val(password);
        $("#selctedRole").val(role);
        $("#nic").val(nic);



        $.ajax({
            url: baseURL2 + "user/search_user?id=" + UserId + "", method: "get", success: function (resp) {
                $("#popUpuserName").val(resp.data.name)
                $("#popUpUserEmail").val(resp.data.email);
                $("#popUpUserAddress").val(resp.data.address)
                $("#popUpUseruserName").val(resp.data.userName)
                $("#popUpUserNic").val(resp.data.nicOrPassportNum)
                $("#popUpUserRole").val(resp.data.role)

                document.getElementById('popUpUseruserName').innerHTML
                    = resp.data.userName;
                document.getElementById('popUpUserEmail').innerHTML
                    = resp.data.email;
                document.getElementById('popUpUserNic').innerHTML
                    = resp.data.nicOrPassportNum;
                document.getElementById('popUpUserAddress').innerHTML
                    = resp.data.address;
                document.getElementById('popUpUserPassword').innerHTML
                    = resp.data.password;
                document.getElementById('popUpuserName').innerHTML
                    = resp.data.name;
                document.getElementById('popUpUserPassword').innerHTML
                    = resp.data.role;



            }, error: function (error) {

            }
        });
    });
}

$("#btmUpdateUser").click(function () {
    let name = $("#Full_name").val();
    let email = $("#email").val();
    let address = $("#address").val();
    let userName = $("#userName").val();
    let password = $("#password").val();
    let role = $("#selctedRole").val();
    let nicOrPassportNum = $("#nic").val();
    let user = {
        id: UserId,
        name: name,
        email: email,
        address: address,
        userName: userName,
        password: password,
        role: role,
        nicOrPassportNum: nicOrPassportNum
    }
    $.ajax({
        type: "PUT", // You might need to adjust this depending on your server's API.
        url: baseURL2 + "user/update_user?id=" + UserId + "", method: "put",
        data: JSON.stringify(user),
        contentType: "application/json",
        success: function (response) {
            alert(" User added successfully:");
            loadALLUser();
            document.getElementById('userForm').reset();
        },
        error: function (error) {
            console.error("Error adding User:", error);
        }
    });

})

$("#btnDeleteUser").click(function () {
    $.ajax({
        url: baseURL2 + "user/delete_user?id=" + UserId + "", method: "delete", success: function (resp) {
            loadALLUser();
            alert("User Deleted successfully:");
            loadALLUser();
            document.getElementById('userForm').reset();
        }, error: function (error) {
            alert(JSON.parse(error.responseText).message);
        }
    });
})

$("btnClearUser").click(function (){
    document.getElementById('userForm').reset();
})
////////Vehicle

loadALLVehicle();
$("#btnSaveCar").click(function () {
    let carName = $("#vName").val();
    let regNumber = $("#registrationNo").val();
    let brand = $("#make").val();
    let category = $("#categoryVehi").val();
    let fuelType = $("#fuel").val();
    let transmissionType = $("#transmission").val();
    let fuelUsage = $("#fuelUsage").val();
    let seatCapacity = $("#noOfPassengers").val();
    let pricePerDay = $("#pricePerDay").val();

    let vehicle = {
        carName:carName,
        regNumber: regNumber,
        brand: brand,
        category: category,
        fuelType: fuelType,
        transmissionType: transmissionType,
        fuelUsage: fuelUsage,
        seatCapacity: seatCapacity,
        pricePerDay: pricePerDay,
        status:"Available"
    }


    $.ajax({
        method: "POST", // You might need to adjust this depending on your server's API.
        url:  baseURL + "vehicle/add_vehicle",
        data: JSON.stringify(vehicle),
        contentType: "application/json",
        success: function (response) {
            alert("Vehicle added successfully:");
            loadALLVehicle();
            document.getElementById('carForm').reset();
        },
        error: function (error) {
            console.error("Error adding vehicle:", error);
        }
    });

});
function loadALLVehicle() {
    $("#tblCar").empty();
    $.ajax({
        url: baseURL + "vehicle/fetch_all", dataType: "json", success: function (resp) {
            for (let dri of resp.data) {
                var row = '<tr><td>' + dri.id + '</td><td>' + dri.regNumber + '</td><td>' + dri.brand + '</td>><td>' + dri.category + '</td><td>' + dri.seatCapacity + '</td><td>' + dri.fuelType + '</td><td>' + dri.transmissionType + '</td><td>' + dri.fuelUsage + '</td><td>' + dri.status + '</td><td><a data-bs-toggle="modal" data-bs-target="#exampleModal4"\n' +
                    'class="text-primary font-monospace" style="cursor: pointer">View</a></td></tr>';
                $("#tblCar").append(row);
            }
            vehicleBindRaw();
        }

    });
}

$("#btnUpdateCar").click(function () {
    let vehicleName = $("#vName").val();
    let regNumber = $("#registrationNo").val();
    let brand = $("#make").val();
    let category = $("#categoryVehi").val();
    let fuelType = $("#fuel").val();
    let transmissionType = $("#transmission").val();
    let fuelUsage = $("#fuelUsage").val();
    let seatCapacity = $("#noOfPassengers").val();
    let pricePerDay = $("#pricePerDay").val();
    let pricePerkm = $("#priceKm").val();

    let vehicle = {
        id: vehicleId,
        carName: vehicleName,
        regNumber: regNumber,
        brand: brand,
        category: category,
        fuelType: fuelType,
        transmissionType: transmissionType,
        fuelUsage: fuelUsage,
        seatCapacity: seatCapacity,
        pricePerDay: pricePerDay,
        pricePerkm: pricePerkm,

    }


    $.ajax({
        method: "PUT", // You might need to adjust this depending on your server's API.
        url: baseURL + "vehicle/update_vehicle",
        data: vehicle,
        dataType: "application/json",
        success: function (response) {
            loadALLVehicle();
            document.getElementById('carForm').reset();
        },
        error: function (error) {
            console.error("Error adding car:", error);
        }
    });


})
var vehicleId;
function vehicleBindRaw(){
    $("#tblCar>tr").click(function () {
        vehicleId = parseInt($(this).find("td:eq(0)").text());
        $.ajax({
            url: baseURL + "vehicle/search_Vehicle?id=" + vehicleId + "", method: "get", success: function (resp) {
                $("#registrationNo").val(resp.data.regNumber);
                $("#vName").val(resp.data.carName)
                $("#make").val(resp.data.brand);
                $("#categoryVehi").val(resp.data.category);
                $("#fuel").val(resp.data.fuelType);
                $("#transmission").val(resp.data.transmissionType);
                $("#fuelUsage").val(resp.data.fuelUsage);
                $("#noOfPassengers").val(resp.data.seatCapacity);
                $("#priceDay").val(resp.data.pricePerDay);
                $("#priceKm").val(resp.data.regNumber);

                document.getElementById('popRegNumber').innerHTML
                    = resp.data.regNumber;
                document.getElementById('popRegBrand').innerHTML
                    = resp.data.brand;
                document.getElementById('popcategory').innerHTML
                    = resp.data.category;
                document.getElementById('popRegFuelType').innerHTML
                    = resp.data.fuelType;
                document.getElementById('popRegTramissionType').innerHTML
                    = resp.data.transmissionType;
                document.getElementById('popRegFuelUsage').innerHTML
                    = resp.data.fuelUsage;
                document.getElementById('popseatCapacity').innerHTML
                    = resp.data.seatCapacity;
                document.getElementById('popPrivePerDay').innerHTML
                    = resp.data.pricePerDay;
            }, error: function (error) {

            }
        });
    })
}
$("#btnDeleteCar").click(function (){
    $.ajax({
        url: baseURL + "vehicle/delete_vehicle?id=" + vehicleId + "", method: "delete", success: function (resp) {
            loadALLUser();
            alert("Vehicle Deleted successfully:");
            loadALLVehicle();
            document.getElementById('carForm').reset();
        }, error: function (error) {
            alert(JSON.parse(error.responseText).message);
        }
    });
})
$("#btnClearCar").click(function (){
    document.getElementById('carForm').reset();
})
loadAllGuide();

$("#btnAddGuide").click(function (){
    let GuideName = $("#guide_name").val();
    let GuideGender = $("#selctedgender").val();
    let GuideAge =$("#age").val();
    let address =$("#guide_address").val();
    let contactNumber =$("#contactNumber").val();
    let manValue = $("#manDayValue").val();
    let GuideStatus = "Available";

    let guide={
        name:GuideName,
        gender:GuideGender,
        age:GuideAge,
        address:address,
        contactNumber:contactNumber,
        manDayPrice:manValue,
        status:GuideStatus,
    }
       $.ajax({
           method: "POST",
           url:baseURL+"/guide/save_guide",
           data: guide,
           dataType: "application/json",
           success: function (response) {
               loadAllGuide();
               document.getElementById('guideForm').reset();
           },
           error: function (error) {
               console.error("Error adding Guide:", error);
           }
       });

})

function loadAllGuide(){
    $("#guideTable").empty();
    $.ajax({
        url:baseURL+"guide/getGuide", dataType: "json", success: function (resp) {
            for (let dri of resp.data) {
                var row = '<tr><td>' + dri.id + '</td><td>' + dri.name + '</td><td>' + dri.gender + '</td>><td>' + dri.address + '</td><td>' + dri.contactNumber + '</td><td>' + dri.manDayPrice + '</td><td>' + dri.age + '</td><td>' + dri.status + '</td><td><a data-bs-toggle="modal" data-bs-target="#exampleModal8"' +
                    'class="text-primary font-monospace" style="cursor: pointer">View</a></td></tr>';
                $("#guideTable").append(row);
            }
          guideBindRaw();
        }

    });
}
var guideId;
function guideBindRaw(){
    $("#guideTable>tr").click(function () {
        guideId = $(this).find("td:eq(0)").text();
        let name = $(this).find("td:eq(1)").text();
        let gender = $(this).find("td:eq(2)").text();
        let address = $(this).find("td:eq(3)").text();
        let contact = $(this).find("td:eq(4)").text();
        let dayValue = $(this).find("td:eq(5)").text();
        let ex = $(this).find("td:eq(6)").text();
        // let nic = $(this).find("td:eq(7)").text();


        $('#guide_name').val(name);
        $('#selctedgender').val(gender);
        $('#guide_address').val(address);
        $('#contactNumber').val(contact);
        $('#manDayValue').val(dayValue);
        $("#age").val(ex);

        $("#name").val(name);
        $("#guide_address").val(address);
        $("#pgender").val(gender);
        $("#contact").val(contact);
        $("#dayValue").val(dayValue);
        $("#guideAge").val(ex);

    })
}
$("#btmUpdateGuide").click(function (){
    let name = $("#guide_name").val();
    let gender = $("#selctedgender").val();
    let age =$("#age").val();
    let address =$("#guide_address");
    let contactNumber =$("#contactNumber").val();
    let experience =$("#Experience").val();
    let manDayValue = $("#manDayValue").val();
    let guide={
        id:guideId,
        name:name,
        gender:gender,
        age:age,
        address:address,
        contactNumber:contactNumber,
        experience:experience,
        manDayValue:manDayValue,

    }
    $.ajax({
        method: "POST", // You might need to adjust this depending on your server's API.
        url: baseURL+"guide/add_guide",
        data: JSON.stringify(guide),
        dataType: "application/json",
        success: function (response) {
            loadAllGuide();
            document.getElementById('guideForm').reset();
            alert("Guide added successfully");
        },
        error: function (error) {
            console.error("Error Updated Guide:", error);
        }
    });

})
$("#btnDeleteGuide").click(function (){
    $.ajax({
        url: baseURL + "guide/deleteGuide?id=" + guideId + "", method: "delete", success: function (resp) {
            loadAllGuide();
            alert("Guide Deleted successfully:");

            document.getElementById('guideForm').reset();
            loadAllGuide();
        }, error: function (error) {
            alert(JSON.parse(error.responseText).message);
        }
    });
})
$("#btnClearGuide").click(function (){
    document.getElementById('guideForm').reset();
})

// /USERVALIDATION/

const nICRegEx = /^[0-9/A-z]{10,15}$/;
const cusFullNameRegEx = /^[A-z ]{2,20}$/;
const addressRegEx = /^[0-9/A-z. ,]{7,}$/;
const cusSalaryRegEx = /^[0-9]{1,}[.]?[0-9]{1,2}$/;
const cusContactRegEx = /^[0-9]{3}[-]?[0-9]{7}$/;
const emailRegEx=/^[a-z0-9]{3,}[@]?[a-z]{1,}[.]?[a-z]{2,}$/;
const passwordRegEx=/^[A-z0-9]{6,}$/;

function UserFormValid(){
    var fullName = $("#Full_name").val()
    $("#Full_name").css('border' , '2px solid green')
    $("#lblFullName").text("")

    if(cusFullNameRegEx.test(fullName)){
        var email = $("#email").val()
        if(emailRegEx.test(email)){
            $("#email").css('border' , '2px solid green')
            $("#lblEmail").text("")
            var address = $("#address").val()

            if(addressRegEx.test(address)){
                $("#address").css('border' , '2px solid green')
                $("#lblAddress").text("")
                var userName = $("#userName").val()

                if(userName != ""){
                    $("#userName").css('border' , '2px solid green')
                    $("#lblUserName").text("")
                    var password = $("#password").val()
                    if(passwordRegEx.test(password)){
                        $("#password").css('border' , '2px solid green')
                        $("#lblPassword").text("")
                        var nic =  $("#nic").val()
                        if(nICRegEx.test(nic)){
                            $("#nic").css('border' , '2px solid green')
                            $("#lblNic").text("")
                            return true;
                        }else {
                            $("#nic").css('border', '2px solid red');
                            $("#lblNic").text("Enter Password");
                            return false;
                        }
                    }else{
                        $("#password").css('border', '2px solid red');
                        $("#lblPassword").text("Enter Password");
                        return false;
                    }
                }else{
                    $("#userName").css('border', '2px solid red');
                    $("#lblUserName").text("Enter User Name");
                    return false;
                }
            }else{
                $("#address").css('border', '2px solid red');
                $("#lblAddress").text("Invalid Address");
                return false;
            }
        }else{
            $("#email").css('border', '2px solid red');
            $("#lblEmail").text("Invalid Email");
            return false;
        }
    }else{
        $("#Full_name").css('border', '2px solid red');
        $("#lblFullName").text("Invalid Full Name");
        return false;
    }

}

function checkIfValid(){
    var fullName = $("#Full_name").val();
    if(cusFullNameRegEx.test(fullName)){
        $("#email").focus();
        var email = $("#email").val();
        if(emailRegEx.test(email)){
            $("#address").focus();
            var address = $("#address").val()
            if(addressRegEx.test(address)){
                $("#userName").focus();
                var userName =  $("#userName").val();
                if(userName != " "){
                    $("#password").focus();
                    var password =  $("#password").val();
                    if(passwordRegEx.test(password)){
                        $("#nic").focus();
                        var nic =  $("#nic").val();
                        if(nICRegEx.test(nic)){

                            saveUser();
                            clearAll();
                        }else{
                            $("#nic").focus();
                        }
                    }else{
                        $("#password").focus();
                    }
                }else{
                    $("#userName").focus();
                }
            }else{
                $("#address").focus();
            }
        }else{
            $("#email").focus();
        }
    }else{
        $("#Full_name").focus();
    }
}

function clearAll() {
    $('#Full_name,#email,#address,#userName,#password,#nic').val("");
    $('#Full_name,#email,#address,#userName,#password,#nic').css('border', '2px solid #ced4da');
    $('#Full_name').focus();
    $("#btnAddUser").attr('disabled', true);

    $("#lblFullName,#lblUserName,#lblAddress,#lblEmail,#lblPassword,#lblNic").text("");

}

$('#Full_name,#email,#address,#userName,#password,#nic').on('keydown', function (eventOb) {
    if (eventOb.key == "Tab") {
        eventOb.preventDefault(); // stop execution of the button
    }
});

$('#Full_name,#email,#address,#userName,#password,#nic').on('blur', function () {
    UserFormValid();
});
$("#Full_name").on('keyup', function (eventOb) {
    setButton();
});

$("#email").on('keyup', function (eventOb) {
    setButton();
});

$("#address").on('keyup', function (eventOb) {
    setButton();
});

$("#userName").on('keyup', function (eventOb) {
    setButton();
});

$("#password").on('keyup', function (eventOb) {
    setButton();
});

$("#nic").on('keyup', function (eventOb) {
    setButton();
});


function setButton() {
    let b = UserFormValid();
    if (b) {
        $("#btnAddUser").attr('disabled', false);
    } else {
        $("#btnAddUser").attr('disabled', true);
    }
}

$('#btnAddUser').click(function () {
    checkIfValid();
});
