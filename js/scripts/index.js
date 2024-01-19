let baseURL = "http://localhost:8080/";

const loggedInUser = {};

$(document).ready(function () {

    $("#contact-form").submit(function (event) {
        event.preventDefault();
        alert("Form submitted! We'll get in touch with you soon.");
    });

    getPackageDetails();
    checkUserStatus();
});

function checkUserStatus() {
    let textContent = document.getElementById('userNameLogged').textContent;
    if (textContent !== "") {
        document.getElementById('continueOnModal').disabled = false;
    } else {
        document.getElementById('continueOnModal').disabled = true;
    }
};

const SuperLuxuryContainer = $("#SuperLuxuryContainer");
const LuxuryContainer = $("#LuxuryContainer");
const MidLevelContainer = $("#MidLevelContainer");
const RegularContainer = $("#RegularContainer");

function getPackageDetails() {
    $.ajax({
        url: baseURL + "packages/get_packages",
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.state === 'Okay' && Array.isArray(response.data)) {
                $.each(response.data, function (index, package) {
                    const packageBox = createPackageBox(package);

                    switch (package.packageCategory) {
                        case "Super Luxury" :
                            SuperLuxuryContainer.append(packageBox);
                            break;
                        case "Luxury" :
                            LuxuryContainer.append(packageBox);
                            break;
                        case "Mid-level" :
                            MidLevelContainer.append(packageBox);
                            break;
                        case "Regular" :
                            RegularContainer.append(packageBox);
                            break;
                    }

                });
            } else {
                console.error("Invalid or empty response from the API.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data: " + error);
        }
    });
};

function createPackageBox(package) {
    let content = `
                        <div class="col-3 mb-2">
                                    <div class="card shadow-sm">
                                        <div class="card-header text-center" >
                                            <h3>${package.packageName}</h3>
                                            <label class="d-none">${package.id}</label>
                                        </div>
                                        <div class="card-body">
                                            <p>${package.description}</p>
                                            <h5 class="card-title">Category : ${package.packageCategory}</h5>
                                            <h5>Star rate : ${package.starRate}</h5>
                                            <h5>Head count : ${package.headCount}</h5>
                                            <button type="button" class="btn bookNowBtn" data-bs-toggle="modal" data-bs-target="#reservationModal" style="background: #FB6011; border-color: #FB601100; height: 10%; color: #ffffff">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                         `

    return content;
};

$(document).on('click', '.bookNowBtn', function () {
    let id = $(this).closest('.card').find('label').text();
    $.ajax({
        url: baseURL + "packages/get_package?id=" + id,
        dataType: "json",
        success: function (resp) {
            let package = resp.data
            $("#packageNameOnModal").text(package.packageName);
            $("#packageDescOnModal").text(package.description);
            $("#packageCategoryOnModal").text(package.packageCategory);
            $("#packageStarRateOnModal").text(package.starRate);
            $("#packageHeadCountOnModal").text(package.headCount);
            $("#packageIdModal").text(id);
        }
    });
});

let packId;

$("#continueOnModal").on("click", function () {
    netAmountCalculation();
    getGuide();
    let starRate = $('#packageStarRateOnModal').text();
    document.getElementById('hotelDropDown').innerHTML = '';
    $.ajax({
        url: baseURL + "hotel?starRate=" + starRate,
        dataType: "json",
        success: function (resp) {
            const obj = Object.keys(resp.data);
            obj.forEach(key => {
                const name = resp.data[key].name;
                const fee = resp.data[key].hotelFee;
                const id = resp.data[key].id;
                const option = document.createElement("option");
                option.text = id + " - " + name + " - " + " LKR " + fee;
                document.getElementById('hotelDropDown').add(option);
            });
        }
    });

    let category = $('#packageCategoryOnModal').text();
    document.getElementById('vehicleDropDown').innerHTML = '';
    $.ajax({
        url: baseURL + "vehicle/category?category=" + category,
        dataType: "json",
        success: function (res) {
            const obj = Object.keys(res.data);
            obj.forEach(key => {
                const vName = res.data[key].carName;
                const pricePerDay = res.data[key].pricePerDay;
                const regNumber = res.data[key].regNumber;
                const option = document.createElement("option");
                option.text = regNumber + " - " + vName + " - LKR " + pricePerDay;
                document.getElementById('vehicleDropDown').add(option);
            });
        }
    });
    document.getElementById('hotelDropDown').click();
    document.getElementById('vehicleDropDown').click();
});

$("#logoutButton").on("click", function () {
    location.reload();
});

$("#loginBtn").on("click", function () {
    let userName = $("#username").val();
    let pw = $("#password").val();

    var user = {
        userName: userName,
        password: pw
    }

    $.ajax({
        url: baseURL + "user/check",
        method: "POST",
        data: JSON.stringify(user),
        contentType: "application/json",
        success: function (response) {
            switch (response.data.role) {
                case "User":
                    $(".login-section").hide();
                    $(".user-name").text(response.data.name);

                    $(".user-section").show();

                    checkUserStatus();
                    loggedInUser.id = response.data.id;
                    loggedInUser.name = response.data.name;
                    loggedInUser.email = response.data.email;
                    loggedInUser.address = response.data.address;
                    loggedInUser.userName = response.data.userName;
                    loggedInUser.nicOrPassportNum = response.data.nicOrPassportNum;
                    loggedInUser.role=response.data.role;
                    loggedInUser.password=response.data.password;
                    break;
                case "Super Admin":
                    // Redirect to the Super Admin page
                    window.location.href = "admin.html?section=super";
                    break;
                case "Driver Admin":
                    // Redirect to the Driver Admin page
                    window.location.href = "admin.html?section=driver";
                    break;
                case "Hotel Admin":
                    // Redirect to the Hotel Admin page
                    window.location.href = "admin.html?section=hotel";
                    break;
                case "Vehicle Admin":
                    // Redirect to the Vehicle Admin page
                    window.location.href = "admin.html?section=vehicle";
                    break;
                case "User Admin":
                    // Redirect to the User Admin page
                    window.location.href = "admin.html?section=user";
                    break;
                case "Travel Admin":
                    // Redirect to the Travel Admin page
                    window.location.href = "admin.html?section=travel-package";
                    break;
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data: " + error);
        }
    });
});

let hotelPrice = 0;
let vehiclePrice = 0;
let startDate = 0;
let endDate = 0;
let dayDifferent = 1;
let netAmount;
let guidePrice = 0;
let hId = 0;
let vRegNumber;

function calculateDate() {
    startDate = document.getElementById('start_date').value;
    endDate = document.getElementById('end_date').value;

    let date1 = new Date(startDate);
    let date2 = new Date(endDate);

    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    dayDifferent = daysDiff;
    netAmountCalculation();
}

function netAmountCalculation() {
    netAmount = 0;
    netAmount += ((hotelPrice * dayDifferent) + (vehiclePrice * dayDifferent) + guidePrice);
    document.getElementById('netAmount').innerHTML = netAmount;
}

$("#hotelDropDown").on("click", function () {
    hotelPrice = parseInt(document.getElementById('hotelDropDown').value.split('LKR ')[1]);
    hId = parseInt(document.getElementById('hotelDropDown').value.split(' - ')[0]);
    netAmountCalculation();
});
$("#vehicleDropDown").on("click", function () {
    vehiclePrice = parseInt(document.getElementById('vehicleDropDown').value.split('LKR ')[1]);
    vRegNumber = document.getElementById('vehicleDropDown').value.split(' - ')[0];
    netAmountCalculation();
});

let gId;
$("#proceedBtn").on("click", function () {

    let dId;

    $.ajax({
        url: baseURL + "driver/available",
        dataType: "json",
        async: true,
        success: function (response) {
            dId = response.data.id;
            let selectedRadioButton = document.querySelector('input[name="radioBtn"]:checked');
            if (selectedRadioButton.id === "yesRadioBtn") {
                $.ajax({
                    url: baseURL + "guide/unavailable?id=" + gId,
                    method: "PUT",
                    dataType: "json",
                    async: true,
                    success: function (resp) {
                        makeReservation(dId, packId);
                    },
                    error: function (error) {
                        alert("There is no available guide at this moment")
                    }
                });
            } else {
                makeReservation(dId, packId);
            }
        },
        error: function (error) {
            alert("There is no available driver at this moment")
        }
    });

});
$('.btn-close').on("click", function () {
    document.getElementById('formOnModal').reset();
});

function getGuide() {
    $.ajax({
        url: baseURL + "guide/available",
        dataType: "json",
        async: true,
        success: function (resp) {
            gId = resp.data.id;
            guidePrice = resp.data.manDayPrice;
            netAmountCalculation();
        },
        error: function (error) {
            alert("There is no available guide at this moment")
        }
    });
};

function driverUnavailable(driverId) {
    $.ajax({
        url: baseURL + "driver/unavailable?id=" + driverId,
        method: "PUT",
        dataType: "json",
        success: function (resp) {
            gId = resp.data.id;
            guidePrice = resp.data.manDayPrice;
            netAmountCalculation();
        },
        error: function (error) {
            alert("Error" + error)
        }
    });
};

$('#yesRadioBtn').on("click", function () {
    getGuide();
});

$('#noRadioBtn').on("click", function () {
    guidePrice = 0;
    gId = null;
    netAmountCalculation();
});

function makeReservation(driverId, packId) {

    let reservation = {
        packageId: packId,
        hotelId: hId,
        vehicleRegNumber: vRegNumber,
        userId: loggedInUser.id,
        status: "Accept",
        totalAmount: netAmount,
        driverId: driverId,
        guideId: gId,
        reservedDate: new Date()
    }

    $.ajax({
        type: "POST",
        url: baseURL + "reservation/make",
        data: JSON.stringify(reservation),
        async: true,
        contentType: "application/json",
        success: function (response) {
            driverUnavailable(driverId);
            alert("Reservation successful");
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
}
$("#userNameLogged").click(function (){

$("#loginName").val(loggedInUser.name);
$("#loginUserEmail").val(loggedInUser.email);
$("#loginAddrres").val(loggedInUser.address);
$("#loginNic").val(loggedInUser.nicOrPassportNum);
})
$("#updateUser").click(function (){
    let name = $("#loginName").val();
    let email = $("#loginUserEmail").val();
    let address = $("#loginAddrres").val();
    let userName = loggedInUser.userName;
    let password = loggedInUser.password;
    let role = loggedInUser.role;
    let nicOrPassportNum = $("#loginNic").val();
    let user = {
        id:loggedInUser.id,
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
        url: baseURL + "user/update_user",
        data: JSON.stringify(user),
        contentType: "application/json",
        success: function (response) {
            alert("Travel User Updated successfully:");
            loggedInUser.name=response.data.name;
            loggedInUser.address=response.data.address;
            loggedInUser.email=response.data.email;
            loggedInUser.nicOrPassportNum=response.data.nicOrPassportNum;
        },
        error: function (error) {
            console.error("Error adding User:", error);
        }
    });

})
$("#bokked_Details").click(function (){
    $("#hotelTable").empty();
    $.ajax({
        url: baseURL + "reservation/getAll?id="+parseInt(loggedInUser.id)+"",
        dataType: "json",
        method:"GET",
        success: function (resp) {
            for (let dri of resp.data) {
                var row = '<tr><td>' + dri.reservationId + '</td><td>' + dri.hotelId + '</td>><td>' + dri.vehicleRegNumber + '</td><td>' + dri.userId + '</td><td>' + dri.totalAmount + '</td><td>' + dri.reservedDate + '</td></tr>';
                $("#resevaionTable").append(row);
            }
        }

    });
})


