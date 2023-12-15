"use strict";

function calculate() {
    var amount = document.getElementById("amount");
    var apr = document.getElementById("apr");
    var years = document.getElementById("years");
    var CEP = document.getElementById("CEP");
    var payment = document.getElementById("payment");
    var total = document.getElementById("total");
    var totalinterest = document.getElementById("totalinterest");

    var principal = parseFloat(amount.value);
    var interest = parseFloat(apr.value) / 100 / 12;
    var payments = parseFloat(years.value) * 12;

    var x = Math.pow(1 + interest, payments);
    var monthly = (principal * x * interest) / (x - 1);

    if (isFinite(monthly)) {
        payment.innerHTML = monthly.toFixed(2);
        total.innerHTML = (monthly * payments).toFixed(2);
        totalinterest.innerHTML = ((monthly * payments) - principal).toFixed(2);

        save(amount.value, apr.value, years.value, CEP.value);

        try {
            getLenders(amount.value, apr.value, years.value, CEP.value);
        } catch (e) {
            // Ignora erros
        }

        chart(principal, interest, monthly, payments);
    } else {
        payment.innerHTML = "";
        total.innerHTML = "";
        totalinterest.innerHTML = "";

        chart(); // Apaga gráfico 
    }
}

function save(amount, apr, years, CEP) {
    if (window.localStorage) {
        localStorage.loan_amount = amount;
        localStorage.loan_apr = apr;
        localStorage.loan_years = years;
        localStorage.loan_CEP = CEP;
    }
}

window.onload = function () {
    if (window.localStorage && localStorage.loan_amount) {
        document.getElementById("amount").value = localStorage.loan_amount;
        document.getElementById("apr").value = localStorage.loan_apr;
        document.getElementById("years").value = localStorage.loan_years;
        document.getElementById("CEP").value = localStorage.loan_CEP;
    }
};

function getLenders(amount, apr, years, CEP) {
    if (!window.XMLHttpRequest) return;

    var ad = document.getElementById("creadores");
    if (!ad) return;

    var url = "getLenders.php" +
        "?amt=" + encodeURIComponent(amount) +
        "&apr=" + encodeURIComponent(apr) +
        "&year=" + encodeURIComponent(years) +
        "&CEP=" + encodeURIComponent(CEP);

    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.send(null);

    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            var response = req.responseText;
            var lenders = JSON.parse(response);

            var list = "";
            for (var i = 0; i < lenders.length; i++) {
                list += "<li><a href='" + lenders[i].url + "'>" + lenders[i].name + "</a></li>";
            }
            ad.innerHTML = "<ul>" + list + "</ul>";
        }
    };
}

function chart(principal, interest, monthly, payments) {
    var canvas = document.getElementById("graph");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;

    // Aqui você pode adicionar a lógica para desenhar o gráfico com base nos parâmetros fornecidos
    // Por exemplo, um gráfico simples com linhas
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
}
